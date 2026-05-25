import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
const jsonBase = import.meta.env.BASE_URL || '/';
const emptyForm = () => ({
  id: '',
  name: '',
  price: '',
  categoryid: '',
  image: '',
  description: '',
  rating: '5',
  sold: '0',
});
function rowToForm(p) {
  return {
    id: String(p.id),
    name: p.name ?? '',
    price: p.price != null ? String(p.price) : '',
    categoryid: p.categoryid != null ? String(p.categoryid) : '',
    image: p.image ?? '',
    description: p.description ?? '',
    rating: p.rating != null ? String(p.rating) : '5',
    sold: p.sold != null ? String(p.sold) : '0',
  };
}
function formToRow(form, nextId) {
  return {
    id: form.id ? Number(form.id) : nextId,
    name: form.name.trim(),
    price: Number(form.price),
    categoryid: Number(form.categoryid),
    image: form.image.trim(),
    description: form.description.trim(),
    rating: Number(form.rating),
    sold: Number(form.sold),
  };
}
function validateRow(built) {
  if (!built.name) return 'Vui lòng nhập tên sản phẩm vật liệu';
  if (!built.price || built.price <= 0) return 'Đơn giá phải là số dương hợp lệ';
  if (!built.categoryid) return 'Vui lòng phân loại nhóm danh mục cho sản phẩm';
  return null;
}
function AdminProduct({ embedded = false }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(embedded);
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyForm);
  const [isNew, setIsNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const displayedRows = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        String(r.id) === q ||
        String(r.name || '').toLowerCase().includes(q)
    );
  }, [rows, appliedSearch]);
  const persist = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      await axios.put('/api/product', nextList, {
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
        'Không thể lưu thông tin sản phẩm lên máy chủ.';
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
        const [pRes, cRes] = await Promise.all([
          fetch(`${jsonBase}Products.json`),
          fetch(`${jsonBase}Category.json`),
        ]);
        if (!pRes.ok) throw new Error('Không tải được danh sách từ Products.json');
        const pData = await pRes.json();
        setRows(Array.isArray(pData) ? pData : []);
        if (cRes.ok) {
          const cData = await cRes.json();
          setCategories(Array.isArray(cData) ? cData : []);
        }
      } catch (e) {
        setLoadError(e.message || 'Lỗi kết nối cơ sở dữ liệu kho sản phẩm');
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
  const openEdit = (p) => {
    setIsNew(false);
    setForm(rowToForm(p));
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
        setSaveError('Không tìm thấy sản phẩm cần cập nhật dữ liệu');
        return;
      }
      nextList = rows.map((r) => (String(r.id) === String(form.id) ? built : r));
    }
    persist(nextList);
  };
  const handleDelete = (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm mặt hàng: ${name} (ID: #${id})?`)) return;
    persist(rows.filter((r) => String(r.id) !== String(id)));
  };
  const applySearch = () => setAppliedSearch(searchQuery.trim());
  const clearSearch = () => {
    setSearchQuery('');
    setAppliedSearch('');
  };
  const getCategoryName = (catId) => {
    const found = categories.find((c) => String(c.id) === String(catId));
    return found ? found.name : `Danh mục #${catId}`;
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
        <div className="ruang-loading" style={{ padding: '2rem', textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px', fontSize: '1.2rem' }} />
          Đang truy xuất kho dữ liệu handmade...
        </div>
      ) : view === 'list' ? (
        <>
          <div className="admin-toolbar">
            <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
              <i className="fa-solid fa-square-plus" /> Khai báo mặt hàng
            </button>
            <div className="admin-toolbar-search">
              <input
                id="admin-product-search"
                type="text"
                placeholder="Tìm theo ID hoặc tên hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applySearch();
                  }
                }}
              />
              <button type="button" className="admin-btn" onClick={applySearch} disabled={saving}>
                <i className="fa-solid fa-magnifying-glass" /> Tra cứu
              </button>
              {appliedSearch.trim() !== '' && (
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearSearch} disabled={saving}>
                  <i className="fa-solid fa-arrow-rotate-left" /> Hủy lọc
                </button>
              )}
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên mặt hàng</th>
                  <th>Phân loại nhóm</th>
                  <th>Đơn giá</th>
                  <th>Đánh giá</th>
                  <th>Đã bán</th>
                  <th style={{ textAlign: 'right' }}>Thao tác kho</th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="admin-table_empty" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      <i className="fa-solid fa-boxes-packing" style={{ display: 'block', fontSize: '2rem', marginBottom: '1rem' }} />
                      {appliedSearch.trim()
                        ? `Không tìm thấy mặt hàng nào khớp từ khóa "${appliedSearch.trim()}".`
                        : 'Kho hàng trống. Hãy khai báo mặt hàng đầu tiên.'}
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: '700', color: '#4f46e5' }}>#{r.id}</td>
                      <td>
                        {r.image ? (
                          <img
                            src={r.image.startsWith('http') || r.image.startsWith('/') ? r.image : `${jsonBase}${r.image}`}
                            alt={r.name}
                            style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                          />
                        ) : (
                          <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <i className="fa-solid fa-image" />
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: '600', maxWidth: '240px' }}>{r.name}</td>
                      <td>
                        <span className="ruang-status" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700' }}>
                          {getCategoryName(r.categoryid)}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', color: '#1e293b' }}>{fmtCurrency(r.price)}</td>
                      <td style={{ fontWeight: '700', color: '#f59e0b' }}>
                        <i className="fa-solid fa-star" style={{ marginRight: '4px' }} />
                        {r.rating ?? '5'}
                      </td>
                      <td style={{ fontWeight: '700' }}>{r.sold ?? 0}</td>
                      <td>
                        <div className="admin-table_actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="admin-table_link"
                            onClick={() => openEdit(r)}
                            disabled={saving}
                          >
                            <i className="fa-solid fa-pen-to-square" /> Sửa thông tin
                          </button>
                          <button
                            type="button"
                            className="admin-table_link admin-table_link--danger"
                            onClick={() => handleDelete(r.id, r.name)}
                            disabled={saving}
                          >
                            <i className="fa-solid fa-trash-can" /> Xóa hàng
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
            <i className="fa-solid fa-box-open" style={{ marginRight: '10px', color: '#4f46e5' }} />
            {isNew ? 'Khai báo thông số vật liệu mới' : `Điều chỉnh thông tin sản phẩm #${form.id}`}
          </h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                Mã định danh sản phẩm (ID)
                <input value={form.id} readOnly style={{ background: '#e2e8f0', cursor: 'not-allowed', fontWeight: 'bold' }} />
              </label>
            )}
            <label className={isNew ? 'admin-form-grid_full' : ''}>
              Tên gọi handmade / sản phẩm
              <input
                type="text"
                placeholder="Nhập tên sản phẩm thương mại..."
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </label>
            <label>
              Đơn giá bán hiện tại (đ)
              <input
                type="number"
                min="0"
                placeholder="Nhập giá niêm yết..."
                value={form.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
                required
              />
            </label>
            <label>
              Nhóm danh mục phân loại
              <select value={form.categoryid} onChange={(e) => handleFormChange('categoryid', e.target.value)} required>
                <option value="">-- Chọn nhóm phân loại --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Mã nhóm: #{c.id})
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-form-grid_full">
              Tệp hình ảnh sản phẩm (Chọn từ máy tính)
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      // Tự động gán đường dẫn img/ phía trước tên file
                      handleFormChange('image', `img/${file.name}`);
                    }
                  }}
                  style={{
                    padding: '0.65rem 1rem', 
                    border: '1px dashed var(--primary)', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem', 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  placeholder="Hoặc dán trực tiếp link ảnh mạng vào đây..."
                  value={form.image}
                  onChange={(e) => handleFormChange('image', e.target.value)}
                  style={{ marginTop: '4px' }}
                />
              </div>
            </label>
            <label>
              Điểm đánh giá hệ thống (Rating từ 1 đến 5)
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="5"
                value={form.rating}
                onChange={(e) => handleFormChange('rating', e.target.value)}
              />
            </label>
            <label>
              Số lượng đã tiêu thụ (Đã bán)
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.sold}
                onChange={(e) => handleFormChange('sold', e.target.value)}
              />
            </label>
            <label className="admin-form-grid_full">
              Mô tả chi tiết đặc tính sản phẩm
              <textarea
                rows={4}
                placeholder="Nhập ghi chú hoặc mô tả thông số sản phẩm..."
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                style={{
                  padding: '0.85rem 1rem',
                  border: '2px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  background: 'var(--bg-app)',
                  transition: 'var(--transition)',
                  outline: 'none',
                  color: 'var(--text-main)',
                  resize: 'vertical',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.backgroundColor = 'var(--bg-surface)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.backgroundColor = 'var(--bg-app)';
                }}
              />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Đang cập nhật...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk" /> Lưu trữ sản phẩm
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
          <i className="fa-solid fa-boxes-stacked" style={{ marginRight: '12px', color: '#4f46e5' }} />
          Hệ thống Quản lý Kho sản phẩm
        </h1>
        <div className="admin-topbar_actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={goHome}>
            <i className="fa-solid fa-house" /> Trang chủ
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
export default AdminProduct;