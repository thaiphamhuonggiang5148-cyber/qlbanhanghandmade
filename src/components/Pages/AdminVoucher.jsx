import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import './Admin.css';

const jsonBase = import.meta.env.BASE_URL || '/';

const emptyForm = () => ({
  id: '',
  code: '',
  type: 'fixed',
  value: '',
  minOrder: '',
  status: 'active',
  limit: '',
  used: '0',
});

function rowToForm(v) {
  return {
    id: String(v.id),
    code: v.code ?? '',
    type: v.type ?? 'fixed',
    value: v.value != null ? String(v.value) : '',
    minOrder: v.minOrder != null ? String(v.minOrder) : '',
    status: v.status ?? 'active',
    limit: v.limit != null ? String(v.limit) : '',
    used: v.used != null ? String(v.used) : '0',
  };
}

function formToRow(form, nextId) {
  return {
    id: form.id ? Number(form.id) : nextId,
    code: form.code.trim().toUpperCase(),
    type: form.type,
    value: Number(form.value),
    minOrder: Number(form.minOrder),
    status: form.status,
    limit: Number(form.limit || 0),
    used: Number(form.used || 0),
  };
}

function fmtCurrency(n) {
  return `${Number(n || 0).toLocaleString('vi-VN')} đ`;
}

function getVoucherStatusBadge(row) {
  const isActive = row.status === 'active' && row.used < row.limit;
  const isExhausted = row.used >= row.limit;

  if (isActive) {
    return (
      <span className="ruang-status ruang-status--done">
        <i className="fa-solid fa-circle-check" style={{ marginRight: '5px' }} />
        Đang chạy
      </span>
    );
  }
  if (isExhausted) {
    return (
      <span className="ruang-status ruang-status--shipping">
        <i className="fa-solid fa-circle-xmark" style={{ marginRight: '5px' }} />
        Hết lượt
      </span>
    );
  }
  return (
    <span className="ruang-status ruang-status--pending">
      <i className="fa-solid fa-pause-circle" style={{ marginRight: '5px' }} />
      Tạm dừng
    </span>
  );
}

function AdminVoucher({ embedded = false }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyForm);
  const [isNew, setIsNew] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const displayedRows = useMemo(() => {
    const q = appliedSearch.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        String(r.id) === q
    );
  }, [rows, appliedSearch]);

  const persist = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      await axios.put('/api/voucher', nextList, {
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
        'Không thể lưu dữ liệu voucher lên hệ thống.';
      setSaveError(msg);
      if (err.code === 'ERR_NETWORK' || err.response?.status === 404) {
        setRows(nextList);
        setView('list');
        setForm(emptyForm());
        setIsNew(false);
      }
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const res = await fetch(`${jsonBase}Voucher.json`);
        if (!res.ok) throw new Error('Không tải được danh sách từ Voucher.json');
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setLoadError(e.message || 'Lỗi kết nối cơ sở dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openCreate = () => {
    setIsNew(true);
    setForm(emptyForm());
    setView('form');
    setSaveError('');
  };

  const openEdit = (v) => {
    setIsNew(false);
    setForm(rowToForm(v));
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
    if (!form.code.trim()) { setSaveError('Vui lòng nhập mã voucher'); return; }
    if (!form.value || Number(form.value) <= 0) { setSaveError('Giá trị giảm phải lớn hơn 0'); return; }
    if (!form.limit || Number(form.limit) <= 0) { setSaveError('Giới hạn lượt sử dụng phải lớn hơn 0'); return; }

    const nextId = rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
    const built = formToRow(form, nextId);
    let nextList = isNew
      ? [...rows, built]
      : rows.map((r) => (String(r.id) === String(form.id) ? built : r));
    persist(nextList);
  };

  const handleDelete = (id, code) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa mã giảm giá "${code}"?`)) return;
    persist(rows.filter((r) => String(r.id) !== String(id)));
  };

  const applySearch = () => setAppliedSearch(searchInput.trim());
  const clearSearch = () => { setSearchInput(''); setAppliedSearch(''); };

  const activeCount = rows.filter((r) => r.status === 'active' && r.used < r.limit).length;

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
        <div className="ruang-loading" style={{ padding: '3rem' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.3rem', color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Đang tải dữ liệu mã giảm giá...</span>
        </div>
      ) : view === 'list' ? (
        <>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'Tổng mã', value: rows.length, icon: 'fa-ticket', color: 'var(--primary)', bg: 'var(--primary-light)' },
              { label: 'Đang hoạt động', value: activeCount, icon: 'fa-circle-check', color: 'var(--success)', bg: 'var(--success-light)' },
              { label: 'Hết / Tạm dừng', value: rows.length - activeCount, icon: 'fa-ban', color: 'var(--danger)', bg: 'var(--danger-light)' },
            ].map((s) => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                background: s.bg, borderRadius: '12px',
                padding: '0.55rem 1rem', flex: '1', minWidth: '130px',
              }}>
                <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: '1rem' }} />
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-toolbar">
            <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
              <i className="fa-solid fa-square-plus" /> Khai báo Voucher mới
            </button>
            <div className="admin-toolbar-search">
              <input
                type="text"
                placeholder="Tìm theo mã voucher..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applySearch(); } }}
              />
              <button type="button" className="admin-btn" onClick={applySearch} disabled={saving}>
                <i className="fa-solid fa-magnifying-glass" /> Tìm
              </button>
              {appliedSearch && (
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearSearch} disabled={saving}>
                  <i className="fa-solid fa-rotate-left" /> Tất cả
                </button>
              )}
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã Voucher</th>
                  <th>Loại giảm</th>
                  <th>Mức giảm</th>
                  <th>Đơn tối thiểu</th>
                  <th>Lượt dùng</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="admin-empty-state">
                        <i className="fa-solid fa-ticket-simple" />
                        <p>
                          {appliedSearch
                            ? `Không tìm thấy voucher nào khớp với "${appliedSearch}".`
                            : 'Chưa có mã giảm giá nào được khai báo.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((r) => {
                    const usedPct = r.limit > 0 ? Math.round((r.used / r.limit) * 100) : 0;
                    return (
                      <tr key={r.id}>
                        <td>
                          <span style={{
                            fontFamily: 'monospace', fontWeight: 800,
                            fontSize: '0.9rem', color: 'var(--primary)',
                            background: 'var(--primary-light)',
                            padding: '3px 10px', borderRadius: '6px',
                            letterSpacing: '0.05em',
                          }}>
                            {r.code}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                            <i className={`fa-solid ${r.type === 'fixed' ? 'fa-money-bill-wave' : 'fa-percent'}`}
                              style={{ marginRight: '6px', color: 'var(--primary)', opacity: 0.7 }} />
                            {r.type === 'fixed' ? 'Tiền mặt' : 'Phần trăm'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                          {r.type === 'fixed' ? fmtCurrency(r.value) : `${r.value}%`}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                          {fmtCurrency(r.minOrder)}
                        </td>
                        <td>
                          <div style={{ minWidth: '90px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-muted)' }}>
                              <span>{r.used} dùng</span>
                              <span>{r.limit} max</span>
                            </div>
                            <div style={{ height: '5px', borderRadius: '999px', background: '#EBEBF8', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', borderRadius: '999px',
                                width: `${Math.min(100, usedPct)}%`,
                                background: usedPct >= 100
                                  ? 'linear-gradient(90deg,#B91C1C,#EF4444)'
                                  : usedPct >= 75
                                    ? 'linear-gradient(90deg,#92400E,#F79009)'
                                    : 'linear-gradient(90deg,#5B59F0,#9B5CF5)',
                                transition: 'width 0.8s ease',
                              }} />
                            </div>
                          </div>
                        </td>
                        <td>{getVoucherStatusBadge(r)}</td>
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
                              onClick={() => handleDelete(r.id, r.code)}
                              disabled={saving}
                            >
                              <i className="fa-solid fa-trash" /> Xóa
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
            <i className="fa-solid fa-ticket" style={{ marginRight: '10px', color: 'var(--primary)' }} />
            {isNew ? 'Khai báo mã giảm giá mới' : `Chỉnh sửa Voucher — ${form.code || `#${form.id}`}`}
          </h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                Mã định danh (ID)
                <input value={form.id} readOnly className="input-readonly" />
              </label>
            )}
            <label className={isNew ? 'admin-form-grid_full' : ''}>
              Mã Voucher (viết hoa liền nhau)
              <input
                value={form.code}
                onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
                required
                placeholder="VD: MOON50K, SALE20PCT..."
                style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}
              />
            </label>
            <label>
              Hình thức giảm giá
              <select value={form.type} onChange={(e) => handleFormChange('type', e.target.value)}>
                <option value="fixed">Giảm số tiền cố định (đ)</option>
                <option value="percent">Giảm theo tỷ lệ phần trăm (%)</option>
              </select>
            </label>
            <label>
              Giá trị giảm
              <input
                type="number"
                min="0"
                placeholder={form.type === 'fixed' ? 'VD: 50000' : 'VD: 20'}
                value={form.value}
                onChange={(e) => handleFormChange('value', e.target.value)}
                required
              />
            </label>
            <label>
              Đơn hàng tối thiểu để áp dụng (đ)
              <input
                type="number"
                min="0"
                placeholder="VD: 500000"
                value={form.minOrder}
                onChange={(e) => handleFormChange('minOrder', e.target.value)}
                required
              />
            </label>
            <label>
              Giới hạn tổng số lần dùng
              <input
                type="number"
                min="1"
                placeholder="VD: 100"
                value={form.limit}
                onChange={(e) => handleFormChange('limit', e.target.value)}
                required
              />
            </label>
            <label>
              Trạng thái phát hành
              <select value={form.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                <option value="active">Cho phép hoạt động công khai</option>
                <option value="disabled">Tạm dừng phát hành</option>
              </select>
            </label>
          </div>

          {form.code && form.value && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px dashed var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
            }}>
              <i className="fa-solid fa-eye" style={{ color: 'var(--primary)', fontSize: '1.1rem' }} />
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '2px' }}>Xem trước</div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                  <span style={{ fontFamily: 'monospace', marginRight: '8px' }}>{form.code || '---'}</span>
                  — Giảm {form.type === 'fixed' ? fmtCurrency(form.value) : `${form.value}%`}
                  {form.minOrder ? ` cho đơn từ ${fmtCurrency(form.minOrder)}` : ''}
                </div>
              </div>
            </div>
          )}

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? (
                <><i className="fa-solid fa-spinner fa-spin" /> Đang lưu...</>
              ) : (
                <><i className="fa-solid fa-floppy-disk" /> Lưu cấu hình</>
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

  return <div className={embedded ? 'admin-product-embed' : 'admin-page'}>{bodyContent}</div>;
}

export default AdminVoucher;
