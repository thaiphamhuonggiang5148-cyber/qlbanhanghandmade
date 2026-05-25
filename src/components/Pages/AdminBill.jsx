import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
const jsonBase = import.meta.env.BASE_URL || '/';
// Đồng bộ với giá trị thực tế trong Bill.json
const STATUS_OPTIONS = [
  { value: 'đã thanh toán', label: 'Đã thanh toán' },
  { value: 'đang xử lý', label: 'Đang xử lý' },
  { value: 'đã hủy', label: 'Đã hủy' },
  { value: 'vận chuyển', label: 'Vận chuyển' },
  { value: 'chưa thanh toán', label: 'Chưa thanh toán' },
];
const emptyForm = () => ({
  id: '',
  customerId: '',
  employeeId: '',
  date: '',
  total: '',
  status: 'đã thanh toán',
});
// Đọc đúng field camelCase từ Bill.json
function rowToForm(b) {
  const d = String(b.date || '').slice(0, 10);
  return {
    id: String(b.id),
    customerId: b.customerId != null ? String(b.customerId) : '',
    employeeId: b.employeeId != null ? String(b.employeeId) : '',
    date: d,
    total: b.total != null ? String(b.total) : '',
    status: String(b.status || 'đã thanh toán').trim().toLowerCase(),
  };
}
// Ghi lại đúng field camelCase để khớp Bill.json
function formToRow(form, nextId) {
  return {
    id: form.id ? form.id : nextId,
    customerId: form.customerId.trim(),
    employeeId: form.employeeId.trim(),
    date: form.date.trim(),
    total: Number(form.total),
    status: String(form.status || 'đã thanh toán').trim().toLowerCase(),
  };
}
function validateRow(built) {
  if (!built.customerId) return 'Vui lòng nhập Mã khách hàng (customerId)';
  if (!built.employeeId) return 'Vui lòng nhập Mã nhân viên (employeeId)';
  if (!Number.isFinite(built.total)) return 'Tổng tiền phải là số hợp lệ';
  if (!built.date) return 'Vui lòng chọn ngày lập hóa đơn';
  return null;
}
function AdminBill({ embedded = false }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(embedded);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyForm);
  const [isNew, setIsNew] = useState(false);
  const [searchIdInput, setSearchIdInput] = useState('');
  const [appliedSearchId, setAppliedSearchId] = useState('');
  const displayedRows = useMemo(() => {
    const q = appliedSearchId.trim();
    if (!q) return rows;
    return rows.filter((r) => String(r.id).toLowerCase().includes(q.toLowerCase()));
  }, [rows, appliedSearchId]);
  const persist = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      await axios.put('/api/bill', nextList, {
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
        'Không thể lưu dữ liệu lên hệ thống.';
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
        const res = await fetch(`${jsonBase}Bill.json`);
        if (!res.ok) throw new Error('Không tải được danh sách từ Bill.json');
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
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
  const openEdit = (b) => {
    setIsNew(false);
    setForm(rowToForm(b));
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
    setForm((f) => ({ ...f, [field]: value }));
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const nextId = `HD${String(rows.length + 1).padStart(4, '0')}`;
    const built = formToRow(form, nextId);
    const invalid = validateRow(built);
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
        setSaveError('Không tìm thấy bản ghi cần cập nhật dữ liệu');
        return;
      }
      nextList = rows.map((r) => (String(r.id) === String(form.id) ? built : r));
    }
    persist(nextList);
  };
  const handleDelete = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này khỏi hệ thống?')) return;
    persist(rows.filter((r) => String(r.id) !== String(id)));
  };
  const applyIdSearch = () => setAppliedSearchId(searchIdInput.trim());
  const clearIdSearch = () => {
    setSearchIdInput('');
    setAppliedSearchId('');
  };
  const fmtCurrency = (n) => `${Number(n || 0).toLocaleString('vi-VN')} đ`;
  // Map status từ JSON sang badge
  const getStatusBadge = (statusRaw) => {
    const status = String(statusRaw || '').toLowerCase().trim();
    const option = STATUS_OPTIONS.find((o) => o.value === status);
    const label = option ? option.label : (statusRaw || 'Chưa xác định');
    let cls = 'unknown';
    if (status === 'đã thanh toán') cls = 'done';
    else if (status === 'đang xử lý') cls = 'processing';
    else if (status === 'đã hủy') cls = 'danger';
    else if (status === 'vận chuyển') cls = 'shipping';
    else if (status === 'chưa thanh toán') cls = 'pending';
    return <span className={`ruang-status ruang-status--${cls}`}>{label}</span>;
  };
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
        <div className="ruang-loading" style={{ padding: '2rem', textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px', fontSize: '1.2rem' }} />
          Đang tải dữ liệu hóa đơn...
        </div>
      ) : view === 'list' ? (
        <>
          <div className="admin-toolbar">
            <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
              <i className="fa-solid fa-plus" /> Thêm hóa đơn
            </button>
            <div className="admin-toolbar-search">
              <input
                id="admin-bill-search-id"
                type="text"
                placeholder="Nhập ID hóa đơn..."
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyIdSearch();
                  }
                }}
              />
              <button type="button" className="admin-btn" onClick={applyIdSearch} disabled={saving}>
                <i className="fa-solid fa-magnifying-glass" /> Tìm
              </button>
              {appliedSearchId.trim() !== '' && (
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearIdSearch} disabled={saving}>
                  <i className="fa-solid fa-rotate-left" /> Tất cả
                </button>
              )}
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã Khách Hàng</th>
                  <th>Mã Nhân Viên</th>
                  <th>Ngày Lập</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-table_empty" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      <i className="fa-solid fa-folder-open" style={{ display: 'block', fontSize: '2rem', marginBottom: '1rem' }} />
                      {appliedSearchId.trim()
                        ? `Không tìm thấy hóa đơn nào trùng khớp với ID "${appliedSearchId.trim()}".`
                        : 'Hiện tại hệ thống chưa ghi nhận hóa đơn nào.'}
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: '700', color: '#4f46e5' }}>#{r.id}</td>
                      {/* Đọc đúng field customerId từ JSON */}
                      <td><i className="fa-solid fa-user" style={{ marginRight: '6px', opacity: 0.5 }} />{r.customerId}</td>
                      {/* Đọc đúng field employeeId từ JSON */}
                      <td><i className="fa-solid fa-id-card" style={{ marginRight: '6px', opacity: 0.5 }} />{r.employeeId}</td>
                      <td><i className="fa-solid fa-calendar-days" style={{ marginRight: '6px', opacity: 0.5 }} />{r.date}</td>
                      <td style={{ fontWeight: '700', color: '#1e293b' }}>{fmtCurrency(r.total)}</td>
                      <td>{getStatusBadge(r.status)}</td>
                      <td>
                        <div className="admin-table_actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="admin-table_link"
                            onClick={() => openEdit(r)}
                            disabled={saving}
                          >
                            <i className="fa-solid fa-pen-to-square" /> Sửa
                          </button>
                          <button
                            type="button"
                            className="admin-table_link admin-table_link--danger"
                            onClick={() => handleDelete(r.id)}
                            disabled={saving}
                          >
                            <i className="fa-solid fa-trash" /> Xóa
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
            <i className="fa-solid fa-file-invoice-dollar" style={{ marginRight: '10px', color: '#4f46e5' }} />
            {isNew ? 'Khởi tạo hóa đơn mới' : `Cập nhật thông tin hóa đơn #${form.id}`}
          </h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                Mã định danh hóa đơn (ID)
                <input value={form.id} readOnly style={{ background: '#e2e8f0', cursor: 'not-allowed', fontWeight: 'bold' }} />
              </label>
            )}
            <label>
              Mã khách hàng (customerId)
              <input
                type="text"
                placeholder="VD: KH010"
                value={form.customerId}
                onChange={(e) => handleFormChange('customerId', e.target.value)}
                required
              />
            </label>
            <label>
              Mã nhân viên lập hóa đơn (employeeId)
              <input
                type="text"
                placeholder="VD: NV007"
                value={form.employeeId}
                onChange={(e) => handleFormChange('employeeId', e.target.value)}
                required
              />
            </label>
            <label>
              Ngày lập hóa đơn
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                required
              />
            </label>
            <label>
              Tổng số tiền hóa đơn (đ)
              <input
                type="number"
                min="0"
                placeholder="Nhập tổng giá trị đơn hàng..."
                value={form.total}
                onChange={(e) => handleFormChange('total', e.target.value)}
                required
              />
            </label>
            <label className="admin-form-grid_full">
              Trạng thái hóa đơn
              <select value={form.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Đang lưu dữ liệu...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk" /> Lưu dữ liệu
                </>
              )}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm} disabled={saving}>
              <i className="fa-solid fa-ban" /> Hủy thao tác
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
          <i className="fa-solid fa-file-invoice-dollar" style={{ marginRight: '12px', color: '#4f46e5' }} />
          Hệ thống Quản trị Hóa đơn
        </h1>
        <div className="admin-topbar_actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={goHome}>
            <i className="fa-solid fa-house" /> Trang chủ chính
          </button>
          <button type="button" className="admin-btn" style={{ background: '#ef4444' }} onClick={logout}>
            <i className="fa-solid fa-right-from-bracket" /> Đăng xuất hệ thống
          </button>
        </div>
      </header>
      <div className="admin-body">{bodyContent}</div>
    </div>
  );
}
export default AdminBill;