import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
const jsonBase = import.meta.env.BASE_URL || '/';
const emptyForm = () => ({
  id: '',
  name: '',
  phone: '',
  email: '',
  address: '',
});
function rowToForm(c) {
  return {
    id: String(c.id),
    name: c.name ?? '',
    phone: c.phone ?? '',
    email: c.email ?? '',
    address: c.address ?? '',
  };
}
function formToRow(form, nextId) {
  return {
    id: form.id ? Number(form.id) : nextId,
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    address: form.address.trim(),
  };
}
function validateRow(built) {
  if (!built.name) return 'Vui lòng nhập tên khách hàng';
  if (!built.phone) return 'Vui lòng nhập số điện thoại';
  return null;
}
function AdminCustomer({ embedded = false }) {
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
    return rows.filter((r) => String(r.id) === q);
  }, [rows, appliedSearchId]);
  const persist = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      await axios.put('/api/customer', nextList, {
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
      if (u.role !== 'staff') {
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
        const res = await fetch(`${jsonBase}Customer.json`);
        if (!res.ok) throw new Error('Không tải được danh sách từ Customer.json');
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
  const openEdit = (c) => {
    setIsNew(false);
    setForm(rowToForm(c));
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
    const nextId = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
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
        setSaveError('Không tìm thấy tài khoản khách hàng cần cập nhật');
        return;
      }
      nextList = rows.map((r) => (String(r.id) === String(form.id) ? built : r));
    }
    persist(nextList);
  };
  const handleDelete = (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ khách hàng: ${name} (ID: #${id})?`)) return;
    persist(rows.filter((r) => String(r.id) !== String(id)));
  };
  const applyIdSearch = () => setAppliedSearchId(searchIdInput.trim());
  const clearIdSearch = () => {
    setSearchIdInput('');
    setAppliedSearchId('');
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
        <div className="ruang-loading" style={{ padding: '2rem', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px', fontSize: '1.2rem' }} />
          Đang tải danh sách khách hàng...
        </div>
      ) : view === 'list' ? (
        <>
          <div className="admin-toolbar">
            <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
              <i className="fa-solid fa-user-plus" /> Thêm khách hàng
            </button>
            <div className="admin-toolbar-search">
              <input
                id="admin-customer-search-id"
                type="text"
                inputMode="numeric"
                placeholder="Tìm theo ID khách..."
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
                <i className="fa-solid fa-magnifying-glass" /> Tìm kiếm
              </button>
              {appliedSearchId.trim() !== '' && (
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearIdSearch} disabled={saving}>
                  <i className="fa-solid fa-rotate-left" /> Làm mới
                </button>
              )}
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Khách Hàng</th>
                  <th>Số Điện Thoại</th>
                  <th>Email</th>
                  <th>Địa Chỉ</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-table_empty" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <i className="fa-solid fa-users-slash" style={{ display: 'block', fontSize: '2rem', marginBottom: '1rem' }} />
                      {appliedSearchId.trim()
                        ? `Không tìm thấy khách hàng nào có ID "${appliedSearchId.trim()}".`
                        : 'Chưa có thông tin khách hàng nào trên hệ thống.'}
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: '700', color: 'var(--primary)' }}>#{r.id}</td>
                      <td style={{ fontWeight: '600' }}>{r.name}</td>
                      <td><i className="fa-solid fa-phone" style={{ marginRight: '6px', opacity: 0.5, fontSize: '0.85rem' }} />{r.phone}</td>
                      <td><i className="fa-solid fa-envelope" style={{ marginRight: '6px', opacity: 0.5, fontSize: '0.85rem' }} />{r.email || '---'}</td>
                      <td><i className="fa-solid fa-location-dot" style={{ marginRight: '6px', opacity: 0.5, fontSize: '0.85rem' }} />{r.address || '---'}</td>
                      <td>
                        <div className="admin-table_actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="admin-table_link"
                            onClick={() => openEdit(r)}
                            disabled={saving}
                          >
                            <i className="fa-solid fa-user-gear" /> Sửa
                          </button>
                          <button
                            type="button"
                            className="admin-table_link admin-table_link--danger"
                            onClick={() => handleDelete(r.id, r.name)}
                            disabled={saving}
                          >
                            <i className="fa-solid fa-user-minus" /> Xóa
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
            <i className="fa-solid fa-address-card" style={{ marginRight: '10px', color: 'var(--primary)' }} />
            {isNew ? 'Đăng ký thông tin khách hàng mới' : `Hồ sơ khách hàng #${form.id}`}
          </h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                Mã định danh (ID)
                <input value={form.id} readOnly className="input-readonly" />
              </label>
            )}
            <label className={isNew ? 'admin-form-grid_full' : ''}>
              Họ và tên khách hàng
              <input
                type="text"
                placeholder="Nhập tên khách hàng..."
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </label>
            <label>
              Số điện thoại liên hệ
              <input
                type="text"
                placeholder="Nhập số điện thoại..."
                value={form.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                required
              />
            </label>
            <label>
              Địa chỉ Email
              <input
                type="email"
                placeholder="ví_dụ@gmail.com (không bắt buộc)..."
                value={form.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
              />
            </label>
            <label className="admin-form-grid_full">
              Địa chỉ thường trú / Giao hàng
              <input
                type="text"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                value={form.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
              />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Đang lưu hồ sơ...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk" /> Lưu thông tin
                </>
              )}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm} disabled={saving}>
              <i className="fa-solid fa-ban" /> Hủy tác vụ
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
          <i className="fa-solid fa-users" style={{ marginRight: '12px', color: 'var(--primary)' }} />
          Hệ thống Quản lý Khách hàng
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
export default AdminCustomer;