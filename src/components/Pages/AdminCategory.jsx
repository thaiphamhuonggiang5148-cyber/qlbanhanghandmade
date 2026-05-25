import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
const jsonBase = import.meta.env.BASE_URL || '/';
const emptyForm = () => ({ id: '', name: '' });
function rowToForm(c) {
  return { id: String(c.id), name: c.name ?? '' };
}
function formToRow(form, nextId) {
  return {
    id: form.id ? Number(form.id) : nextId,
    name: form.name.trim(),
  };
}
function AdminCategory({ embedded = false }) {
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
      await axios.put('/api/category', nextList, {
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
        const [cRes, pRes] = await Promise.all([
          fetch(`${jsonBase}Category.json`),
          fetch(`${jsonBase}Products.json`)
        ]);
        if (!cRes.ok) throw new Error('Không tải được danh sách từ Category.json');
        const cData = await cRes.json();
        setRows(Array.isArray(cData) ? cData : []);
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
    if (!form.name.trim()) {
      setSaveError('Vui lòng nhập tên danh mục');
      return;
    }
    const nextId = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
    const built = formToRow(form, nextId);
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
  const handleDelete = (category) => {
    const linkedProducts = products.filter(
      (p) => p.categoryid != null && String(p.categoryid) === String(category.id)
    );
    if (linkedProducts.length > 0) {
      const msg = `CẢNH BÁO NGUY HIỂM:\nDanh mục "${category.name}" hiện đang có ${linkedProducts.length} sản phẩm liên kết.\n\nNếu bạn xóa danh mục này, các sản phẩm đó sẽ bị mất gán danh mục (mồ côi).\nBạn có chắc chắn vẫn muốn xóa hoàn toàn danh mục này không?`;
      if (!window.confirm(msg)) return;
    } else {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) return;
    }
    persist(rows.filter((r) => String(r.id) !== String(category.id)));
  };
  const applyIdSearch = () => setAppliedSearchId(searchIdInput.trim());
  const clearIdSearch = () => {
    setSearchIdInput('');
    setAppliedSearchId('');
  };
  const getProductCount = (catId) => {
    return products.filter((p) => p.categoryid != null && String(p.categoryid) === String(catId)).length;
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
          Đang tải dữ liệu danh mục...
        </div>
      ) : view === 'list' ? (
        <>
          <div className="admin-toolbar">
            <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
              <i className="fa-solid fa-plus" /> Thêm danh mục
            </button>
            <div className="admin-toolbar-search">
              <input
                id="admin-category-search-id"
                type="text"
                inputMode="numeric"
                placeholder="Nhập ID danh mục..."
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
                  <th>ID danh mục</th>
                  <th>Tên danh mục</th>
                  <th>Số lượng sản phẩm thuộc nhóm</th>
                  <th style={{ textAlign: 'right' }}>Thao tác hệ thống</th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-table_empty" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      <i className="fa-solid fa-box-open" style={{ display: 'block', fontSize: '2rem', marginBottom: '1rem' }} />
                      {appliedSearchId.trim()
                        ? `Không tìm thấy danh mục nào trùng khớp với ID "${appliedSearchId.trim()}".`
                        : 'Hiện tại chưa có phân loại danh mục nào được khởi tạo.'}
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => {
                    const count = getProductCount(r.id);
                    return (
                      <tr key={r.id}>
                        <td style={{ fontWeight: '700', color: '#4f46e5' }}>#{r.id}</td>
                        <td style={{ fontWeight: '600' }}>{r.name}</td>
                        <td>
                          <span 
                            className={`ruang-status`} 
                            style={{ 
                              background: count > 0 ? 'var(--primary-light)' : '#f1f5f9',
                              color: count > 0 ? 'var(--primary)' : 'var(--text-muted)',
                              fontWeight: '700'
                            }}
                          >
                            <i className="fa-solid fa-boxes-stacked" style={{ marginRight: '6px' }} />
                            {count} mặt hàng
                          </span>
                        </td>
                        <td>
                          <div className="admin-table_actions" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="admin-table_link"
                              onClick={() => openEdit(r)}
                              disabled={saving}
                            >
                              <i className="fa-solid fa-pen-to-square" /> Sửa tên
                            </button>
                            <button
                              type="button"
                              className="admin-table_link admin-table_link--danger"
                              onClick={() => handleDelete(r)}
                              disabled={saving}
                            >
                              <i className="fa-solid fa-trash" /> Xóa nhóm
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form className="admin-form-card" onSubmit={handleSubmitForm}>
          <h2>
            <i className="fa-solid fa-tags" style={{ marginRight: '10px', color: '#4f46e5' }} />
            {isNew ? 'Khởi tạo phân loại danh mục mới' : `Cập nhật thông tin danh mục #${form.id}`}
          </h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                Mã định danh danh mục (ID)
                <input value={form.id} readOnly style={{ background: '#e2e8f0', cursor: 'not-allowed', fontWeight: 'bold' }} />
              </label>
            )}
            <label className="admin-form-grid_full">
              Tên gọi danh mục phân loại
              <input
                type="text"
                placeholder="Nhập tên danh mục vật liệu (Ví dụ: Cát xây dựng, Xi măng...)"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
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
                  <i className="fa-solid fa-floppy-disk" /> Lưu phân loại
                </>
              )}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm} disabled={saving}>
              <i className="fa-solid fa-ban" /> Hủy bỏ tác vụ
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
          <i className="fa-solid fa-tags" style={{ marginRight: '12px', color: '#4f46e5' }} />
          Hệ thống Quản lý Danh mục Vật liệu
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
export default AdminCategory;