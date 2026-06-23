import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function readStoredUser() {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => readStoredUser());
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [delPass, setDelPass] = useState('');
  const [delErr, setDelErr] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/', { replace: true });
  };

  const clearPasswordForm = () => {
    setCurPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwErr('');
    setPwMsg('');
    const c = curPass.trim();
    const n1 = newPass.trim();
    const n2 = confirmPass.trim();
    if (!c || !n1) {
      setPwErr('Nhập đủ mật khẩu hiện tại và mật khẩu mới');
      return;
    }
    if (n1 !== n2) {
      setPwErr('Mật khẩu mới và xác nhận không khớp');
      return;
    }
    if (n1.length < 3) {
      setPwErr('Mật khẩu mới tối thiểu 3 ký tự');
      return;
    }
    try {
      const { data } = await axios.post('/api/change-password', {
        id: user.id,
        currentPass: c,
        newPass: n1,
      });
      setPwMsg(data.message || 'Đã đổi mật khẩu thành công');
      clearPasswordForm();
    } catch (err) {
      const msg = err.response?.data?.error || 'Không đổi được mật khẩu. Vui lòng kiểm tra API.';
      setPwErr(msg);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDelErr('');
    const p = delPass.trim();
    if (!p) {
      setDelErr('Nhập mật khẩu để xác nhận xóa');
      return;
    }
    if (window.confirm('Xóa vĩnh viễn tài khoản này? Thao tác không hoàn tác.')) {
      try {
        await axios.post('/api/delete-account', {
          id: user.id,
          password: p,
        });
        localStorage.removeItem('currentUser');
        window.dispatchEvent(new Event('userUpdated'));
        navigate('/', { replace: true });
      } catch (err) {
        const msg = err.response?.data?.error || 'Không xóa được. Vui lòng kiểm tra API.';
        setDelErr(msg);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        
        {/* Cột trái: Thông tin cá nhân */}
        <div className="profile-card user-info-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className="profile-name">{user.name || 'Người dùng'}</h1>
            <span className="profile-role">{user.role || 'Thành viên'}</span>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Tên đăng nhập</span>
              <span className="detail-value">{user.user || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mã ID</span>
              <span className="detail-value">{user.id || '-'}</span>
            </div>
          </div>

          <button onClick={handleLogout} className="profile-btn btn-logout">
            Đăng xuất
          </button>
        </div>

        {/* Cột phải: Form thay đổi & Xóa */}
        <div className="profile-card actions-card">
          
          {/* Đổi mật khẩu */}
          <section className="profile-section">
            <h2 className="section-title">Đổi mật khẩu</h2>
            <form className="profile-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={curPass}
                  onChange={(e) => setCurPass(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Tối thiểu 3 ký tự"
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              {pwErr && <div className="msg-box error">{pwErr}</div>}
              {pwMsg && <div className="msg-box success">{pwMsg}</div>}
              <button type="submit" className="profile-btn btn-primary">
                Cập nhật mật khẩu
              </button>
            </form>
          </section>

          <hr className="divider" />

          {/* Xóa tài khoản */}
          <section className="profile-section section-danger">
            <h2 className="section-title text-danger">Xóa tài khoản</h2>
            <p className="danger-hint">
              Thao tác này sẽ xóa vĩnh viễn dữ liệu của bạn và không thể khôi phục.
            </p>
            <form className="profile-form" onSubmit={handleDeleteAccount}>
              <div className="form-group">
                <label>Mật khẩu xác nhận</label>
                <input
                  type="password"
                  value={delPass}
                  onChange={(e) => setDelPass(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu để tiếp tục"
                />
              </div>
              {delErr && <div className="msg-box error">{delErr}</div>}
              <button type="submit" className="profile-btn btn-danger">
                Xóa tài khoản
              </button>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Profile;