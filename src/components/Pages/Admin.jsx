import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminProduct from './AdminProduct';
import AdminCategory from './AdminCategory';
import AdminCustomer from './AdminCustomer';
import AdminEmployee from './AdminEmployee';
import AdminBill from './AdminBill';
import AdminInvoiceDetails from './AdminInvoiceDetails';
import AdminVoucher from './AdminVoucher'; // Thêm import AdminVoucher
import "./Admin.css";
const jsonBase = import.meta.env.BASE_URL || "/";
const SECTION_LABEL = {
  dashboard: "Dashboard",
  products: "Sản phẩm",
  category: "Danh mục",
  customer: "Khách hàng",
  employee: "Nhân viên",
  bill: "Hóa đơn",
  invoiceDetails: "Chi tiết hóa đơn",
  voucher: "Mã giảm giá", // Thêm label cho voucher
};
function fmtNumber(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function fmtCurrency(n) {
  return `${fmtNumber(Number(n) || 0)} đ`;
}
// Cập nhật map trạng thái đồng bộ với CSS mới
const BILL_STATUS_MAP = {
  "delivered": { label: "Đã giao hàng", cls: "done" },
  "shipping": { label: "Vận chuyển", cls: "shipping" },
  "pending": { label: "Chưa giải quyết", cls: "pending" },
  "processing": { label: "Đang xử lý", cls: "processing" },
  "đã thanh toán": { label: "Đã thanh toán", cls: "done" },
  "chưa thanh toán": { label: "Chưa thanh toán", cls: "pending" },
  "đã hủy": { label: "Đã hủy", cls: "danger" },
};
function billStatusFromJson(statusRaw) {
  const key = String(statusRaw || "").trim().toLowerCase();
  if (BILL_STATUS_MAP[key]) return { key, ...BILL_STATUS_MAP[key] };
  return {
    key: "unknown",
    label: statusRaw ? String(statusRaw).trim() : "Chưa xác định",
    cls: "unknown",
  };
}
const REVENUE_PER_PAGE = 7;
const Admin = () => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [adminSection, setAdminSection] = useState("dashboard");
  const [revenuePage, setRevenuePage] = useState(0);
  const userMenuRef = useRef(null);
  useEffect(() => {
    const raw = localStorage.getItem("currentUser");
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      const u = JSON.parse(raw);
      if (u.role !== "staff" && u.role !== "admin") {
        navigate("/");
        return;
      }
      setAllowed(true);
    } catch {
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    if (!allowed) return;
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [pRes, cRes, bRes, cuRes, eRes, iRes] = await Promise.all([
          fetch(`${jsonBase}Products.json`),
          fetch(`${jsonBase}Category.json`),
          fetch(`${jsonBase}Bill.json`),
          fetch(`${jsonBase}Customer.json`),
          fetch(`${jsonBase}Employee.json`),
          fetch(`${jsonBase}Invoicedetails.json`)
        ]);
        if (!pRes.ok) throw new Error("Không tải được Products.json");
        const pdata = await pRes.json();
        setProducts(Array.isArray(pdata) ? pdata : []);
        if (cRes.ok) {
          const cdata = await cRes.json();
          setCategories(Array.isArray(cdata) ? cdata : []);
        }
        if (bRes.ok) {
          const bdata = await bRes.json();
          setBills(Array.isArray(bdata) ? bdata : []);
        }
        if (cuRes.ok) {
          const cudata = await cuRes.json();
          setCustomers(Array.isArray(cudata) ? cudata : []);
        }
        if (eRes.ok) {
          const edata = await eRes.json();
          setEmployees(Array.isArray(edata) ? edata : []);
        }
        if (iRes.ok) {
          const idata = await iRes.json();
          setInvoiceDetails(Array.isArray(idata) ? idata : []);
        }
      } catch (e) {
        setLoadError(e.message || "Lỗi tải dữ liệu cơ sở");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [allowed]);
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);
  const staffInitials = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (!raw) return "AD";
      const u = JSON.parse(raw);
      const name = String(u.user || u.name || "Admin").trim();
      const parts = name.split(/\s+/).filter(Boolean);
      if (!parts.length) return "AD";
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } catch {
      return "AD";
    }
  }, []);
  const staffDisplayName = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (!raw) return "Administrator";
      const u = JSON.parse(raw);
      return String(u.user || u.name || "Admin").trim() || "Administrator";
    } catch {
      return "Administrator";
    }
  }, []);
  const stats = useMemo(() => {
    const total = products.length;
    const soldSum = invoiceDetails.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const catCount = categories.length;
    const uncategorized = products.filter((p) => p.categoryid == null || p.categoryid === "").length;
    const revenue = bills.reduce((sum, bill) => sum + Number(bill.total || 0), 0);
    const avgBill = bills.length ? revenue / bills.length : 0;
    return { total, soldSum, catCount, uncategorized, revenue, avgBill };
  }, [products, categories, invoiceDetails, bills]);
  const topSoldProducts = useMemo(() => {
    const byProduct = invoiceDetails.reduce((map, item) => {
      const pid = Number(item.productId || item.product_id);
      const quantity = Number(item.quantity || 0);
      map.set(pid, (map.get(pid) || 0) + quantity);
      return map;
    }, new Map());
    return [...byProduct.entries()]
      .map(([id, sold]) => {
        const product = products.find((p) => Number(p.id) === id);
        return {
          id,
          sold,
          name: product?.name || `Sản phẩm #${id}`,
        };
      })
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((p) => {
        const sold = Number(p.sold || 0);
        const percent = Math.max(0, Math.min(100, Math.round((sold / 800) * 100)));
        return { id: p.id, name: p.name, sold, percent };
      });
  }, [products, invoiceDetails]);
  const revenueByDate = useMemo(() => {
    const grouped = bills.reduce((acc, bill) => {
      const key = String(bill.date || "").slice(0, 10) || "N/A";
      acc.set(key, (acc.get(key) || 0) + Number(bill.total || 0));
      return acc;
    }, new Map());
    const rows = [...grouped.entries()]
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .reverse();
    const maxTotal = rows.reduce((m, row) => Math.max(m, row.total), 0);
    return rows.map((row) => ({
      ...row,
      percent: maxTotal > 0 ? Math.max(8, Math.round((row.total / maxTotal) * 100)) : 0,
    }));
  }, [bills]);
  const billTableRows = useMemo(() => {
    const customerMap = new Map(customers.map((c) => [String(c.id), c.name]));
    const productMap = new Map(products.map((p) => [Number(p.id), p.name]));
    const detailByBill = invoiceDetails.reduce((map, item) => {
      const key = String(item.billId || item.bill_id);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
      return map;
    }, new Map());
    return [...bills]
      .sort((a, b) => String(b.id).localeCompare(String(a.id)))
      .slice(0, 6)
      .map((bill) => {
        const details = detailByBill.get(String(bill.id)) || [];
        const firstProduct = details[0];
        const itemName = firstProduct ? productMap.get(Number(firstProduct.productId || firstProduct.product_id)) || firstProduct.productName || `Mặt hàng #${firstProduct.productId || firstProduct.product_id}` : "---";
        return {
          id: bill.id,
          billCode: String(bill.id),
          customerName: customerMap.get(String(bill.customerId || bill.customer_id)) || `KH #${bill.customerId || bill.customer_id}`,
          itemName,
          status: billStatusFromJson(bill.status),
        };
      });
  }, [bills, customers, products, invoiceDetails]);
  const vipCustomers = useMemo(() => {
    if (!bills.length) return [];
    const latestDate = bills
      .map((bill) => String(bill.date || ""))
      .sort()
      .slice(-1)[0];
    const targetMonth = latestDate.slice(0, 7);
    const customerMap = new Map(customers.map((c) => [String(c.id), c.name]));
    const grouped = bills.reduce((map, bill) => {
      if (!String(bill.date || "").startsWith(targetMonth)) return map;
      const cid = String(bill.customerId || bill.customer_id);
      if (!map.has(cid)) {
        map.set(cid, { customerId: cid, total: 0, count: 0 });
      }
      const row = map.get(cid);
      row.total += Number(bill.total || 0);
      row.count += 1;
      return map;
    }, new Map());
    return [...grouped.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((row) => ({
        ...row,
        name: customerMap.get(row.customerId) || `Khách hàng ID #${row.customerId}`,
      }));
  }, [bills, customers]);
  const goHome = () => navigate("/");
  const logout = () => {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
    setLogoutModalOpen(false);
  };
  const closeMobileNav = () => setMobileSidebarOpen(false);
  if (!allowed) return <div className="ruang-boot" aria-hidden />;
  const revenueTotalPages = Math.ceil(revenueByDate.length / REVENUE_PER_PAGE);
  const revenuePagedRows = revenueByDate.slice(revenuePage * REVENUE_PER_PAGE, (revenuePage + 1) * REVENUE_PER_PAGE);
  return (
    <div className="ruang-layout">
      <div className={`ruang-overlay ${mobileSidebarOpen ? "is-visible" : ""}`} onClick={closeMobileNav} aria-hidden={!mobileSidebarOpen} />
      <aside className={`ruang-sidebar ${mobileSidebarOpen ? "is-open" : ""}`}>
        <div className="ruang-sidebar_brand">
          <span className="ruang-sidebar_brand-icon">
            <i className="fa-solid fa-layer-group" aria-hidden />
          </span>
          <span>SoulMade</span>
        </div>
        <hr className="ruang-sidebar_divider" />
        <div className="ruang-sidebar_heading">Hệ thống</div>
        <ul className="ruang-sidebar_nav">
          <li>
            <button
              type="button"
              className={`ruang-sidebar_link ${adminSection === "dashboard" ? "is-active" : ""}`}
              onClick={() => { setAdminSection("dashboard"); closeMobileNav(); }}
            >
              <i className="fa-solid fa-chart-pie" aria-hidden /> Dashboard
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`ruang-sidebar_link ${adminSection === "products" ? "is-active" : ""}`}
              onClick={() => { setAdminSection("products"); closeMobileNav(); }}
            >
              <i className="fa-solid fa-boxes-stacked" aria-hidden /> Kho Sản phẩm
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`ruang-sidebar_link ${adminSection === "category" ? "is-active" : ""}`}
              onClick={() => { setAdminSection("category"); closeMobileNav(); }}
            >
              <i className="fa-solid fa-tags" aria-hidden /> Danh mục
            </button>
          </li>
          {/* NÚT THÊM VOUCHER */}
          <li>
            <button
              type="button"
              className={`ruang-sidebar_link ${adminSection === "voucher" ? "is-active" : ""}`}
              onClick={() => { setAdminSection("voucher"); closeMobileNav(); }}
            >
              <i className="fa-solid fa-ticket" aria-hidden /> Quản lý Voucher
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`ruang-sidebar_link ${adminSection === "customer" ? "is-active" : ""}`}
              onClick={() => { setAdminSection("customer"); closeMobileNav(); }}
            >
              <i className="fa-solid fa-users" aria-hidden /> Hồ sơ Khách hàng
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`ruang-sidebar_link ${adminSection === "employee" ? "is-active" : ""}`}
              onClick={() => { setAdminSection("employee"); closeMobileNav(); }}
            >
              <i className="fa-solid fa-user-tie" aria-hidden /> Quản lý Nhân sự
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`ruang-sidebar_link ${adminSection === "bill" ? "is-active" : ""}`}
              onClick={() => { setAdminSection("bill"); closeMobileNav(); }}
            >
              <i className="fa-solid fa-file-invoice-dollar" aria-hidden /> Quản trị Hóa đơn
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`ruang-sidebar_link ${adminSection === "invoiceDetails" ? "is-active" : ""}`}
              onClick={() => { setAdminSection("invoiceDetails"); closeMobileNav(); }}
            >
              <i className="fa-solid fa-receipt" aria-hidden /> Chi tiết Hóa đơn
            </button>
          </li>
        </ul>
      </aside>
      <div className="ruang-shell">
        <header className="ruang-topbar">
          <button type="button" className="ruang-topbar_toggle" onClick={() => setMobileSidebarOpen((v) => !v)} aria-label="Menu">
            <i className="fa-solid fa-bars-staggered" />
          </button>
          <div className="ruang-breadcrumb-wrap" style={{ fontWeight: '700', color: 'var(--primary)' }}>
            {SECTION_LABEL[adminSection] || "Quản trị viên"}
          </div>
          <div className="ruang-topbar_right">
            <button type="button" className="ruang-notify" aria-label="Tin nhắn">
              <i className="fa-regular fa-envelope" />
              <span className="ruang-badge">{Math.min(9, stats.total)}+</span>
            </button>
            <button type="button" className="ruang-notify" aria-label="Thông báo">
              <i className="fa-regular fa-bell" />
              <span className="ruang-badge">3</span>
            </button>
            <div className="ruang-user" ref={userMenuRef}>
              <button type="button" className="ruang-user_toggle" onClick={() => setUserMenuOpen((v) => !v)} aria-expanded={userMenuOpen}>
                <span className="ruang-user_avatar">{staffInitials}</span>
                <span className="ruang-user_name">{staffDisplayName}</span>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: "0.65rem", opacity: 0.6 }} />
              </button>
              {userMenuOpen && (
                <div className="ruang-user_menu" role="menu">
                  <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tài khoản</div>
                  <button type="button" role="menuitem" onClick={goHome}>
                    <i className="fa-solid fa-house" /> Trở về cửa hàng
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setUserMenuOpen(false); setLogoutModalOpen(true); }}
                    style={{ color: 'var(--danger)' }}
                  >
                    <i className="fa-solid fa-power-off" /> Đăng xuất hệ thống
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="ruang-main">
          {adminSection === "dashboard" && loadError && (
            <div className="admin-msg admin-msg--error">
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }} /> {loadError}
            </div>
          )}
          {/* HIỂN THỊ COMPONENT TƯƠNG ỨNG */}
          {adminSection === "products" ? <AdminProduct embedded={true} /> :
            adminSection === "category" ? <AdminCategory embedded={true} /> :
              adminSection === "voucher" ? <AdminVoucher embedded={true} /> : // Render AdminVoucher
                adminSection === "customer" ? <AdminCustomer embedded={true} /> :
                  adminSection === "employee" ? <AdminEmployee embedded={true} /> :
                    adminSection === "bill" ? <AdminBill embedded={true} /> :
                      adminSection === "invoiceDetails" ? <AdminInvoiceDetails embedded={true} /> :
                        loading ? (
                          <div className="ruang-loading" style={{ padding: '2rem', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }}>
                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px', fontSize: '1.2rem' }} /> Đang khởi tạo Dashboard...
                          </div>
                        ) : (
                          <>
                            <div className="ruang-cards">
                              <div className="ruang-stat-card">
                                <div className="ruang-stat-card_body">
                                  <div className="ruang-stat-card_label">Tổng Doanh Thu</div>
                                  <div className="ruang-stat-card_value" style={{ color: 'var(--primary)' }}>{fmtCurrency(stats.revenue)}</div>
                                  <div className="ruang-stat-card_badge">{fmtNumber(bills.length)} đơn thành công</div>
                                </div>
                                <div className="ruang-stat-card_icon" aria-hidden>
                                  <i className="fa-solid fa-wallet" />
                                </div>
                              </div>
                              <div className="ruang-stat-card ruang-stat-card--green">
                                <div className="ruang-stat-card_body">
                                  <div className="ruang-stat-card_label">Sản Phẩm Đã Bán</div>
                                  <div className="ruang-stat-card_value">{fmtNumber(stats.soldSum)}</div>
                                  <div className="ruang-stat-card_badge">Từ hệ thống hóa đơn</div>
                                </div>
                                <div className="ruang-stat-card_icon" aria-hidden>
                                  <i className="fa-solid fa-boxes-packing" />
                                </div>
                              </div>
                              <div className="ruang-stat-card ruang-stat-card--cyan">
                                <div className="ruang-stat-card_body">
                                  <div className="ruang-stat-card_label">Mạng Lưới Đối Tác</div>
                                  <div className="ruang-stat-card_value">{fmtNumber(customers.length)}</div>
                                  <div className="ruang-stat-card_badge">{fmtNumber(employees.length)} nhân sự nội bộ</div>
                                </div>
                                <div className="ruang-stat-card_icon" aria-hidden>
                                  <i className="fa-solid fa-users-rays" />
                                </div>
                              </div>
                              <div className="ruang-stat-card ruang-stat-card--amber">
                                <div className="ruang-stat-card_body">
                                  <div className="ruang-stat-card_label">Danh Mục / Hóa Đơn TB</div>
                                  <div className="ruang-stat-card_value">{fmtNumber(stats.catCount)} / {fmtCurrency(stats.avgBill)}</div>
                                  <div className="ruang-stat-card_badge" style={{ background: stats.uncategorized > 0 ? '#fee2e2' : '#d1fae5', color: stats.uncategorized > 0 ? 'var(--danger)' : 'var(--success)' }}>
                                    {stats.uncategorized > 0 ? `${stats.uncategorized} SP chưa phân loại` : "Dữ liệu đồng bộ chuẩn"}
                                  </div>
                                </div>
                                <div className="ruang-stat-card_icon" aria-hidden>
                                  <i className="fa-solid fa-chart-line" />
                                </div>
                              </div>
                            </div>
                            <div className="ruang-dashboard-grid">
                              <div className="ruang-card">
                                <div className="ruang-card_title-bar">
                                  <h6><i className="fa-solid fa-chart-column" style={{ marginRight: '8px', color: 'var(--primary)' }} /> Thống kê doanh thu theo ngày</h6>
                                </div>
                                <div className="ruang-revenue-list">
                                  {revenuePagedRows.map((row) => (
                                    <div className="ruang-revenue-item" key={row.date}>
                                      <div className="ruang-revenue-item_head">
                                        <span style={{ fontWeight: '600' }}><i className="fa-regular fa-calendar" style={{ marginRight: '6px' }} />{row.date}</span>
                                        <strong style={{ color: 'var(--text-main)' }}>{fmtCurrency(row.total)}</strong>
                                      </div>
                                      <div className="ruang-revenue-item_bar">
                                        <div className="ruang-revenue-item_fill" style={{ width: `${row.percent}%` }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {revenueTotalPages > 1 && (
                                  <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                                    <button className="ruang-mini-btn" onClick={() => setRevenuePage((p) => p - 1)} disabled={revenuePage === 0}>
                                      <i className="fa-solid fa-chevron-left" /> Trước
                                    </button>
                                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Trang {revenuePage + 1} / {revenueTotalPages}</span>
                                    <button className="ruang-mini-btn" onClick={() => setRevenuePage((p) => p + 1)} disabled={revenuePage + 1 >= revenueTotalPages}>
                                      Sau <i className="fa-solid fa-chevron-right" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="ruang-card">
                                <div className="ruang-card_title-bar">
                                  <h6><i className="fa-solid fa-fire-flame-curved" style={{ marginRight: '8px', color: 'var(--danger)' }} /> Top Bán Chạy</h6>
                                </div>
                                <div className="ruang-sold-list">
                                  {topSoldProducts.map((item, idx) => (
                                    <div className="ruang-sold-item" key={item.id}>
                                      <div className="ruang-sold-item_head">
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{item.name}</span>
                                        <strong style={{ color: 'var(--primary)' }}>{item.sold}</strong>
                                      </div>
                                      <div className="ruang-sold-item_bar">
                                        <div className={`ruang-sold-item_fill ruang-sold-item_fill--${idx % 4}`} style={{ width: `${item.percent}%` }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="ruang-bottom-grid">
                              <div className="ruang-card">
                                <div className="ruang-card_title-bar">
                                  <h6><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '8px', color: 'var(--primary)' }} /> Giao dịch gần đây</h6>
                                  <button type="button" className="ruang-detail-btn" onClick={() => setAdminSection("bill")}>
                                    Xem toàn bộ <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }} />
                                  </button>
                                </div>
                                <div className="admin-table-wrap" style={{ padding: '0' }}>
                                  <table className="admin-table" style={{ borderSpacing: 0 }}>
                                    <thead>
                                      <tr>
                                        <th style={{ borderBottom: '1px solid var(--border)' }}>ID</th>
                                        <th style={{ borderBottom: '1px solid var(--border)' }}>Khách hàng</th>
                                        <th style={{ borderBottom: '1px solid var(--border)' }}>Mặt hàng đầu tiên</th>
                                        <th style={{ borderBottom: '1px solid var(--border)' }}>Trạng thái</th>
                                        <th style={{ borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Thao tác</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {billTableRows.map((row) => (
                                        <tr key={row.id} style={{ boxShadow: 'none', borderBottom: '1px solid var(--bg-app)' }}>
                                          <td style={{ fontWeight: '700', color: 'var(--primary)' }}>#{row.billCode}</td>
                                          <td style={{ fontWeight: '600' }}><i className="fa-solid fa-user" style={{ marginRight: '6px', opacity: 0.5 }} />{row.customerName}</td>
                                          <td>{row.itemName}</td>
                                          <td>
                                            <span className={`ruang-status ruang-status--${row.status.cls}`}>{row.status.label}</span>
                                          </td>
                                          <td style={{ textAlign: 'right' }}>
                                            <button type="button" className="admin-table_link" onClick={() => setAdminSection("bill")}>
                                              <i className="fa-solid fa-eye" /> Chi tiết
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="ruang-card">
                                <div className="ruang-card_title-bar">
                                  <h6><i className="fa-solid fa-crown" style={{ marginRight: '8px', color: 'var(--warning)' }} /> Khách VIP (Tháng này)</h6>
                                </div>
                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                  {vipCustomers.map((vip, index) => (
                                    <div key={vip.customerId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: index < vipCustomers.length - 1 ? '1px dashed var(--border)' : 'none' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: index === 0 ? '#fef3c7' : index === 1 ? '#f1f5f9' : index === 2 ? '#ffedd5' : 'var(--primary-light)', color: index === 0 ? '#d97706' : index === 1 ? '#475569' : index === 2 ? '#c2410c' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
                                          {index + 1}
                                        </div>
                                        <div>
                                          <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem' }}>{vip.name}</strong>
                                          <small style={{ color: 'var(--text-muted)', fontWeight: '600' }}><i className="fa-solid fa-bag-shopping" style={{ marginRight: '4px' }} /> {vip.count} đơn hàng</small>
                                        </div>
                                      </div>
                                      <div style={{ fontWeight: '800', color: 'var(--success)' }}>
                                        {fmtCurrency(vip.total)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
        </main>
        <footer className="ruang-footer">Hệ thống Quản trị viên - SoulMade &copy; {new Date().getFullYear()}</footer>
      </div>
      {logoutModalOpen && (
        <div className="ruang-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ruang-modal">
            <div className="ruang-modal_header">
              <h5><i className="fa-solid fa-circle-exclamation" style={{ color: 'var(--warning)', marginRight: '8px' }} /> Xác nhận bảo mật</h5>
              <button type="button" className="ruang-modal_close" onClick={() => setLogoutModalOpen(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="ruang-modal_body">
              Phiên làm việc của bạn sẽ kết thúc. Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị không?
            </div>
            <div className="ruang-modal_footer">
              <button type="button" className="ruang-modal_btn" onClick={() => setLogoutModalOpen(false)} style={{ background: 'var(--bg-app)', color: 'var(--text-main)' }}>
                Giữ tôi lại
              </button>
              <button type="button" className="ruang-modal_btn ruang-modal_btn--danger" onClick={logout}>
                Đồng ý đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;