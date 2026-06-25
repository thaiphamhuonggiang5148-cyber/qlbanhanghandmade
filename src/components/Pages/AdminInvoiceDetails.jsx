import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
const jsonBase = import.meta.env.BASE_URL || '/';
const emptyForm = () => ({
  id: '',
  billId: '',      
  productId: '',  
  quantity: '',
  price: '',
});

function rowToForm(d) {
  return {
    id: String(d.id),
    billId: d.billId != null ? String(d.billId) : '',
    productId: d.productId != null ? String(d.productId) : '',
    quantity: d.quantity != null ? String(d.quantity) : '',
    price: d.price != null ? String(d.price) : '',
  };
}

function formToRow(form, nextId) {
  return {
    id: form.id ? Number(form.id) : nextId,
    billId: form.billId.trim(),
    productId: Number(form.productId),
    quantity: Number(form.quantity),
    price: Number(form.price),
    subtotal: Number(form.quantity) * Number(form.price),
  };
}
function validateRow(built, products) {
  if (!built.billId) return 'Vui lòng nhập Mã hóa đơn (billId)';
  if (!built.productId) return 'Vui lòng nhập Mã sản phẩm (productId)';
  if (!built.quantity || built.quantity <= 0) return 'Số lượng phải lớn hơn 0';
  if (!built.price || built.price <= 0) return 'Đơn giá phải lớn hơn 0';
  const targetProd = products.find(p => Number(p.id) === built.productId);
  if (!targetProd) return `Không tìm thấy sản phẩm với mã ID #${built.productId} trong hệ thống`;
  return null;
}
function AdminInvoiceDetails({ embedded = false }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(embedded);
  const [rows, setRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyForm);
  const [isNew, setIsNew] = useState(false);
  const [searchBillInput, setSearchBillInput] = useState('');
  const [appliedSearchBill, setAppliedSearchBill] = useState('');
  const displayedRows = useMemo(() => {
    const q = appliedSearchBill.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => String(r.billId).toLowerCase().includes(q));
  }, [rows, appliedSearchBill]);
  const persist = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      await axios.put('/api/invoicedetails', nextList, {
        headers: { 'Content-Type': 'application/json' },
      });
      setRows(nextList);
      setView('list');
      setForm(emptyForm());
      setIsNew(false);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK' || err.response?.status === 404
          ? 'Hệ thống đang chạy ở chế độ Demo (API ghi file yêu cầu môi trường dev server).'
          : null) ||
        'Không thể lưu dữ liệu chi tiết hóa đơn lên hệ thống.';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  }, []);
  useEffect(() => {
    if (embedded) {
      setAllowed(true);
      return;
    }
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const u = JSON.parse(raw);
      if (u.role !== 'staff' && u.role !== 'admin') {
        navigate('/');
        return;
      }
      setAllowed(true);
    } catch {
      navigate('/login');
    }
  }, [navigate, embedded]);
  useEffect(() => {
    if (!allowed) return;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const [dRes, pRes] = await Promise.all([
          fetch(`${jsonBase}Invoicedetails.json`),
          fetch(`${jsonBase}Products.json`)
        ]);
        if (!dRes.ok) throw new Error('Không tải được danh sách từ Invoicedetails.json');
        const dData = await dRes.json();
        setRows(Array.isArray(dData) ? dData : []);
        if (pRes.ok) {
          const pData = await pRes.json();
          setProducts(Array.isArray(pData) ? pData : []);
        }
      } catch (e) {
        setLoadError(e.message || 'Lỗi kết nối cơ sở dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [allowed]);
  const goHome = () => navigate('/');
  const logout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/login');
  };
  const openCreate = () => {
    setIsNew(true);
    setForm(emptyForm());
    setView('form');
    setSaveError('');
  };
  const openEdit = (d) => {
    setIsNew(false);
    setForm(rowToForm(d));
    setView('form');
    setSaveError('');
  };
  const cancelForm = () => {
    setView('list');
    setForm(emptyForm());
    setIsNew(false);
    setSaveError('');
  };
  const handleFormChange = (field, value) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === 'productId' && value) {
        const prod = products.find(p => String(p.id) === String(value));
        if (prod && prod.price) {
          next.price = String(prod.price);
        }
      }
      return next;
    });
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const nextId = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
    const built = formToRow(form, nextId);
    const invalid = validateRow(built, products);
    if (invalid) {
      setSaveError(invalid);
      return;
    }
    let nextList;
    if (isNew) {
      nextList = [...rows, built];
    } else {
      const idx = rows.findIndex((r) => String(r.id) === String(form.id));
      if (idx === -1) {
        setSaveError('Không tìm thấy bản ghi chi tiết hóa đơn cần cập nhật');
        return;
      }
      nextList = rows.map((r) => (String(r.id) === String(form.id) ? built : r));
    }
    persist(nextList);
  };
  const handleDelete = (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa dòng sản phẩm chi tiết này (ID: #${id}) không?`)) return;
    persist(rows.filter((r) => String(r.id) !== String(id)));
  };
  const applyBillSearch = () => setAppliedSearchBill(searchBillInput.trim());
  const clearBillSearch = () => {
    setSearchBillInput('');
    setAppliedSearchBill('');
  };
  const getProductName = (prodId) => {
    const prod = products.find((p) => String(p.id) === String(prodId));
    return prod ? prod.name : `Sản phẩm #${prodId}`;
  };
  const fmtCurrency = (n) => `${Number(n || 0).toLocaleString('vi-VN')} đ`;
  const bodyContent = (
    <>
      {loadError && (
        <div className="admin-msg admin-msg--error">
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }} />
          {loadError}
        </div>
      )}
      {saveError && (
        <div className="admin-msg admin-msg--error">
          <i className="fa-solid fa-circle-xmark" style={{ marginRight: '8px' }} />
          {saveError}
        </div>
      )}
      {loading ? (
        <div className="ruang-loading" style={{ padding: '2rem', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px', fontSize: '1.2rem' }} />
          Đang tải dữ liệu chi tiết hóa đơn...
        </div>
      ) : view === 'list' ? (
        <>
          <div className="admin-toolbar">
            <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
              <i className="fa-solid fa-plus" /> Thêm sản phẩm vào hóa đơn
            </button>
            <div className="admin-toolbar-search">
              <input
                id="admin-invoice-search-bill-id"
                type="text"
                placeholder="Lọc theo Mã hóa đơn (VD: HD0001)..."
                value={searchBillInput}
                onChange={(e) => setSearchBillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyBillSearch();
                  }
                }}
              />
              <button type="button" className="admin-btn" onClick={applyBillSearch} disabled={saving}>
                <i className="fa-solid fa-filter" /> Lọc
              </button>
              {appliedSearchBill.trim() !== '' && (
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearBillSearch} disabled={saving}>
                  <i className="fa-solid fa-rotate-left" /> Xem tất cả
                </button>
              )}
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã dòng</th>
                  <th>Mã Hóa Đơn</th>
                  <th>Sản Phẩm</th>
                  <th>Số Lượng</th>
                  <th>Đơn Giá</th>
                  <th>Thành Tiền</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-table_empty" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <i className="fa-solid fa-receipt" style={{ display: 'block', fontSize: '2rem', marginBottom: '1rem' }} />
                      {appliedSearchBill.trim()
                        ? `Không tìm thấy chi tiết mặt hàng nào thuộc Hóa đơn #${appliedSearchBill.trim()}.`
                        : 'Hiện chưa có dữ liệu chi tiết mặt hàng hóa đơn.'}
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => (
                    <tr key={r.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>#{r.id}</td>
                      {/* Đọc đúng billId từ JSON */}
                      <td style={{ fontWeight: '700', color: 'var(--primary)' }}>#{r.billId}</td>
                      <td style={{ fontWeight: '600' }}>
                        <i className="fa-solid fa-box" style={{ marginRight: '6px', opacity: 0.5 }} />
                        {/* Ưu tiên productName có sẵn trong JSON, fallback lookup */}
                        {r.productName || getProductName(r.productId)}
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                          Mã SP: #{r.productId}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700' }}>{r.quantity}</td>
                      <td>{fmtCurrency(r.price)}</td>
                      {/* Dùng subtotal từ JSON nếu có, fallback tính lại */}
                      <td style={{ fontWeight: '700', color: 'var(--success)' }}>
                        {fmtCurrency(r.subtotal != null ? r.subtotal : r.quantity * r.price)}
                      </td>
                      <td>
                        <div className="admin-table_actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="admin-table_link"
                            onClick={() => openEdit(r)}
                            disabled={saving}
                          >
                            <i className="fa-solid fa-eraser" /> Sửa
                          </button>
                          <button
                            type="button"
                            className="admin-table_link admin-table_link--danger"
                            onClick={() => handleDelete(r.id)}
                            disabled={saving}
                          >
                            <i className="fa-solid fa-trash-can" /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form className="admin-form-card" onSubmit={handleSubmitForm}>
          <h2>
            <i className="fa-solid fa-circle-info" style={{ marginRight: '10px', color: 'var(--primary)' }} />
            {isNew ? 'Bổ sung mặt hàng vào hóa đơn' : `Cập nhật thông tin dòng sản phẩm #${form.id}`}
          </h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                Mã dòng chi tiết (ID)
                <input value={form.id} readOnly className="input-readonly" />
              </label>
            )}
            <label className={isNew ? 'admin-form-grid_full' : ''}>
              Mã hóa đơn liên kết (billId)
              <input
                type="text"
                placeholder="VD: HD0001"
                value={form.billId}
                onChange={(e) => handleFormChange('billId', e.target.value)}
                required
              />
            </label>
            <label className="admin-form-grid_full">
              Chọn sản phẩm mặt hàng
              <select value={form.productId} onChange={(e) => handleFormChange('productId', e.target.value)} required>
                <option value="">-- Chọn sản phẩm có trong hệ thống --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} - {p.name} ({fmtCurrency(p.price)})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Số lượng mua
              <input
                type="number"
                min="1"
                placeholder="Nhập số lượng mặt hàng..."
                value={form.quantity}
                onChange={(e) => handleFormChange('quantity', e.target.value)}
                required
              />
            </label>
            <label>
              Đơn giá xuất kho (đ)
              <input
                type="number"
                min="0"
                placeholder="Giá tự động điền hoặc nhập tùy chỉnh..."
                value={form.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
                required
              />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Đang ghi nhận...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check" /> Lưu chi tiết
                </>
              )}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm} disabled={saving}>
              <i className="fa-solid fa-ban" /> Hủy bỏ
            </button>
          </div>
        </form>
      )}
    </>
  );
  if (embedded) return <div className="admin-product-embed">{bodyContent}</div>;
  if (!allowed) return <div className="admin-page" />;
  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <h1 className="admin-topbar_title">
          <i className="fa-solid fa-receipt" style={{ marginRight: '12px', color: 'var(--primary)' }} />
          Quản lý Chi tiết Hóa đơn
        </h1>
        <div className="admin-topbar_actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={goHome}>
            <i className="fa-solid fa-house" /> Trang chủ
          </button>
          <button type="button" className="admin-btn admin-btn--danger" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket" /> Đăng xuất
          </button>
        </div>
      </header>
      <div className="admin-body">{bodyContent}</div>
    </div>
  );
}
export default AdminInvoiceDetails;