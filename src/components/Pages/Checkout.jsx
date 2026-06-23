import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const fmt = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';
const parse = (s) => parseFloat(s?.toString().replace(/[^\d]/g, '')) || 0;

const STORE = { lat: 10.7442, lng: 106.6343, name: 'SoulMade' };

const TIERS = [
  { id: 1, maxKm: 5, fee: 0, label: 'Miễn phí', color: 'free' },
  { id: 2, maxKm: 15, fee: 30000, label: '+30.000đ', color: 'low' },
  { id: 3, maxKm: 30, fee: 50000, label: '+50.000đ', color: 'mid' },
  { id: 4, maxKm: 60, fee: 100000, label: '+100.000đ', color: 'high' },
  { id: 5, maxKm: 100, fee: 150000, label: '+150.000đ', color: 'high' },
  { id: 6, maxKm: 999, fee: null, label: 'Liên hệ báo giá', color: 'contact' },
];

const roadKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371, r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r, dLng = (lng2 - lng1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.35;
};

const getTier = (km) => TIERS.find(t => km <= t.maxKm) ?? TIERS[TIERS.length - 1];

const NOM = 'https://nominatim.openstreetmap.org';
const NOM_HEADERS = { 'User-Agent': 'SoulMade-Checkout/1.0', 'Accept-Language': 'vi' };

const geocode = async (text) => {
  const res = await fetch(`${NOM}/search?format=json&q=${encodeURIComponent(text + ', Việt Nam')}&countrycodes=vn&limit=1`, { headers: NOM_HEADERS });
  const data = await res.json();
  if (!data[0]) return null;
  return { lat: +data[0].lat, lng: +data[0].lon };
};

const reverseGeocode = async (lat, lng) => {
  const res = await fetch(`${NOM}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, { headers: NOM_HEADERS });
  return await res.json();
};

export default function Checkout() {
  const navigate = useNavigate();
  const { state: rs = {} } = useLocation();

  const mapDomRef = useRef(null);
  const mapRef = useRef(null);
  const deliveryMarkerRef = useRef(null);
  const geocodeTimer = useRef(null);

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const [form, setForm] = useState({ fullName: '', phone: '', province: '', district: '', ward: '', street: '', note: '' });
  const [payMethod, setPayMethod] = useState('cod');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (!raw) { navigate('/cart'); return; }
      const items = JSON.parse(raw);
      if (!Array.isArray(items) || !items.length) { navigate('/cart'); return; }
      setCartItems(items);
    } catch { navigate('/cart'); }
    finally { setCartLoading(false); }
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    const boot = () => {
      if (!mounted || !mapDomRef.current || !window.L) return;
      const L = window.L;

      const map = L.map(mapDomRef.current, { center: [STORE.lat, STORE.lng], zoom: 13, zoomControl: true });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 20 }).addTo(map);

      const storeIcon = L.divIcon({
        html: `<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#f97316);border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;font-size:15px">🏪</div>`,
        className: '', iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -17],
      });
      L.marker([STORE.lat, STORE.lng], { icon: storeIcon, zIndexOffset: 100 }).addTo(map).bindPopup(`<b>${STORE.name}</b>`);

      const pinIcon = L.divIcon({
        html: `<div style="width:30px;height:42px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 42" width="30" height="42"><ellipse cx="15" cy="39" rx="6" ry="3" fill="rgba(0,0,0,.18)"/><path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 27 15 27S30 25.5 30 15 23.284 0 15 0z" fill="#ef4444"/><circle cx="15" cy="15" r="6" fill="#fff"/></svg></div>`,
        className: '', iconSize: [30, 42], iconAnchor: [15, 42], popupAnchor: [0, -42],
      });
      const dMarker = L.marker([STORE.lat, STORE.lng], { icon: pinIcon, draggable: true, zIndexOffset: 200, opacity: 0 }).addTo(map);

      mapRef.current = map;
      deliveryMarkerRef.current = dMarker;
      if (mounted) setMapReady(true);

      map.on('click', (e) => {
        if (!mounted) return;
        handleMapPick(e.latlng.lat, e.latlng.lng);
      });

      dMarker.on('dragend', () => {
        if (!mounted) return;
        const ll = dMarker.getLatLng();
        handleMapPick(ll.lat, ll.lng);
      });
    };

    if (!document.getElementById('lf-css')) {
      const l = document.createElement('link');
      l.id = 'lf-css'; l.rel = 'stylesheet';
      l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(l);
    }

    if (window.L) {
      boot();
    } else if (!document.getElementById('lf-js')) {
      const s = document.createElement('script');
      s.id = 'lf-js';
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = boot;
      document.head.appendChild(s);
    } else {
      document.getElementById('lf-js').addEventListener('load', boot, { once: true });
    }

    return () => {
      mounted = false;
      mapRef.current?.remove();
      mapRef.current = null;
      deliveryMarkerRef.current = null;
    };
  }, []);

  const handleMapPick = async (lat, lng) => {
    const m = deliveryMarkerRef.current;
    const map = mapRef.current;
    if (!m || !map) return;

    m.setLatLng([lat, lng]);
    m.setOpacity(1);

    const km = roadKm(STORE.lat, STORE.lng, lat, lng);
    setDeliveryInfo({ km, tier: getTier(km) });

    setGeocoding(true);
    try {
      const data = await reverseGeocode(lat, lng);
      if (data && data.address) {
        const addr = data.address;
        
        // Mở rộng các key để bắt dữ liệu linh hoạt hơn
        const street = [addr.house_number, addr.road, addr.neighbourhood].filter(Boolean).join(', ');
        const ward = addr.suburb || addr.quarter || addr.village || addr.hamlet || '';
        const district = addr.city_district || addr.district || addr.county || addr.town || addr.borough || '';
        const province = addr.city || addr.state || addr.province || addr.region || '';

        setForm(prev => ({
          ...prev,
          street: street || '',
          ward: ward || '',
          district: district || '',
          province: province || ''
        }));
      }
    } catch {}
    finally { setGeocoding(false); }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddressInput = (e) => {
    handleInput(e);
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    const fullAddress = [nextForm.street, nextForm.ward, nextForm.district, nextForm.province].filter(Boolean).join(', ');

    clearTimeout(geocodeTimer.current);
    if (fullAddress.trim().length > 8) {
      geocodeTimer.current = setTimeout(async () => {
        setGeocoding(true);
        try {
          const coords = await geocode(fullAddress);
          if (!coords || !mapRef.current || !deliveryMarkerRef.current) return;
          deliveryMarkerRef.current.setLatLng([coords.lat, coords.lng]).setOpacity(1);
          mapRef.current.panTo([coords.lat, coords.lng]);
          mapRef.current.setZoom(16);
          const km = roadKm(STORE.lat, STORE.lng, coords.lat, coords.lng);
          setDeliveryInfo({ km, tier: getTier(km) });
        } catch {}
        finally { setGeocoding(false); }
      }, 1200);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Bắt buộc';
    if (!/^0\d{9}$/.test(form.phone.trim())) e.phone = 'Không hợp lệ';
    if (!form.province.trim()) e.province = 'Bắt buộc';
    if (!form.district.trim()) e.district = 'Bắt buộc';
    if (!form.ward.trim()) e.ward = 'Bắt buộc';
    if (!form.street.trim()) e.street = 'Bắt buộc';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const appliedVoucher = rs.appliedVoucher || null;
  const discountAmount = rs.discountAmount || 0;
  const fallbackSub = cartItems.reduce((s, it) => s + parse(it.currentPrice) * it.quantity, 0);
  const finalSub = rs.subTotal || fallbackSub;
  const shipFee = deliveryInfo ? deliveryInfo.tier.fee : 0;
  const isContact = deliveryInfo?.tier.fee === null;
  const finalTotal = isContact ? finalSub - discountAmount : finalSub - discountAmount + (shipFee ?? 0);
  const fullAddressToSave = [form.street, form.ward, form.district, form.province].filter(Boolean).join(', ');

  const renderShip = () => {
    if (!deliveryInfo) return <span className="ship-pending">Chọn địa chỉ để xem</span>;
    if (isContact) return <span className="ship-contact">Liên hệ báo giá</span>;
    if (shipFee === 0) return <span className="ship-free">✓ Miễn phí</span>;
    return <span className="ship-fee">+{fmt(shipFee)}</span>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const names = cartItems.map(it =>
      it.selectedVariantName ? `${it.name} (${it.selectedVariantName}) x${it.quantity}` : `${it.name} x${it.quantity}`
    ).join(', ');

    const bill = {
      id: Date.now(),
      customerId: user.id || user.userId || 999,
      customerName: form.fullName,
      phone: form.phone,
      address: fullAddressToSave,
      note: form.note,
      paymentMethod: payMethod,
      date: new Date().toISOString().slice(0, 10),
      total: finalTotal,
      shippingFee: isContact ? 'contact' : shipFee,
      deliveryKm: deliveryInfo?.km?.toFixed(1) ?? null,
      status: 'chưa thanh toán',
      usedVoucher: appliedVoucher?.code ?? null,
      discount: discountAmount,
      appliedForProducts: names,
    };

    try { await axios.post('/api/checkout-bill', bill); }
    catch {
      const prev = JSON.parse(localStorage.getItem('demo_bills') || '[]');
      localStorage.setItem('demo_bills', JSON.stringify([bill, ...prev]));
    }

    alert(`✅ Đặt hàng thành công!\nCảm ơn ${form.fullName} đã mua sắm tại SoulMade.`);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    navigate('/');
  };

  if (cartLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: "'Be Vietnam Pro',sans-serif", color: '#94a3b8', gap: 12 }}>
      <div style={{ width: 20, height: 20, border: '2.5px solid #e5ddd0', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'co-spin .65s linear infinite' }} />
    </div>
  );

  return (
    <div className="co-wrap">
      <header className="co-header">
        <button className="co-breadcrumb" type="button" onClick={() => navigate('/cart')}>← Giỏ hàng</button>
        <h1 className="co-title">Xác nhận đơn hàng</h1>
        <nav className="co-steps">
          <span className="cstep done">🛒 Giỏ hàng</span><span className="cstep-sep">›</span>
          <span className="cstep active">📋 Thanh toán</span><span className="cstep-sep">›</span>
          <span className="cstep">✅ Hoàn tất</span>
        </nav>
      </header>

      <form className="co-grid" onSubmit={handleSubmit} noValidate>
        <div className="co-left">
          <section className="co-card">
            <div className="co-card-title"><span>👤</span>Thông tin người nhận</div>
            <div className="co-row2">
              <div className={`co-field ${errors.fullName ? 'err' : ''}`}>
                <label>Họ và tên <i>*</i></label>
                <input name="fullName" value={form.fullName} onChange={handleInput} placeholder="Nguyễn Văn A" autoComplete="name" />
                {errors.fullName && <em>{errors.fullName}</em>}
              </div>
              <div className={`co-field ${errors.phone ? 'err' : ''}`}>
                <label>Số điện thoại <i>*</i></label>
                <input name="phone" value={form.phone} type="tel" onChange={handleInput} placeholder="0901 234 567" autoComplete="tel" />
                {errors.phone && <em>{errors.phone}</em>}
              </div>
            </div>
          </section>

          <section className="co-card">
            <div className="co-card-title"><span>📍</span>Địa chỉ giao hàng</div>
            <p className="co-card-hint">Nhập địa chỉ bên dưới để bản đồ tự định vị, hoặc <strong>nhấp / kéo ghim đỏ</strong> để chọn vị trí — địa chỉ sẽ tự điền lại.</p>

            <div className="co-row2" style={{ marginBottom: 14 }}>
              <div className={`co-field ${errors.province ? 'err' : ''}`}>
                <label>Tỉnh/Thành <i>*</i></label>
                <input name="province" value={form.province} onChange={handleAddressInput} placeholder="VD: TP.HCM" />
                {errors.province && <em>{errors.province}</em>}
              </div>
              <div className={`co-field ${errors.district ? 'err' : ''}`}>
                <label>Quận/Huyện <i>*</i></label>
                <input name="district" value={form.district} onChange={handleAddressInput} placeholder="VD: Quận 6" />
                {errors.district && <em>{errors.district}</em>}
              </div>
            </div>

            <div className="co-row2" style={{ marginBottom: 14 }}>
              <div className={`co-field ${errors.ward ? 'err' : ''}`}>
                <label>Phường/Xã <i>*</i></label>
                <input name="ward" value={form.ward} onChange={handleAddressInput} placeholder="VD: Phường 11" />
                {errors.ward && <em>{errors.ward}</em>}
              </div>
              <div className={`co-field ${errors.street ? 'err' : ''}`}>
                <label>Số nhà, đường <i>*</i>{geocoding && <span className="geocoding-badge">🔍 Đang tìm...</span>}</label>
                <input name="street" value={form.street} onChange={handleAddressInput} placeholder="VD: 215 Nguyễn Văn Luông" autoComplete="street-address" />
                {errors.street && <em>{errors.street}</em>}
              </div>
            </div>

            <div className="map-outer">
              <div ref={mapDomRef} className="map-canvas" />
              {!mapReady && <div className="map-overlay"><div className="map-spin" />Đang tải...</div>}
              {mapReady && !deliveryInfo && <div className="map-click-hint">Nhấp vào bản đồ để đặt ghim địa chỉ</div>}
            </div>

            {deliveryInfo && (
              <div className={`del-result tier-${deliveryInfo.tier.color}`}>
                <div className="del-stats">
                  <div className="del-stat">
                    <span className="dst-icon">📏</span>
                    <span className="dst-val">{deliveryInfo.km.toFixed(1)} km</span>
                    <span className="dst-lbl">từ cửa hàng</span>
                  </div>
                  <div className="del-stat highlight">
                    <span className="dst-icon">🚚</span>
                    <span className="dst-val">{deliveryInfo.tier.label}</span>
                    <span className="dst-lbl">phí vận chuyển</span>
                  </div>
                </div>
              </div>
            )}

            <div className="co-field mt12">
              <label>Ghi chú cho tài xế <span className="co-opt">(Tùy chọn)</span></label>
              <input name="note" value={form.note} onChange={handleInput} placeholder="VD: Xe tải nhỏ vào được hẻm..." />
            </div>
          </section>

          <section className="co-card">
            <div className="co-card-title"><span>💳</span>Phương thức thanh toán</div>
            <div className="pm-list">
              {[{ val: 'cod', icon: '💵', title: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt cho shipper khi nhận vật liệu.' }, { val: 'bank', icon: '🏦', title: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản với nội dung là số điện thoại của bạn.' }].map(p => (
                <label key={p.val} className={`pm-item ${payMethod === p.val ? 'on' : ''}`}>
                  <input type="radio" name="pay" value={p.val} checked={payMethod === p.val} onChange={() => setPayMethod(p.val)} />
                  <span className="pm-ico">{p.icon}</span>
                  <div className="pm-txt"><strong>{p.title}</strong><span>{p.desc}</span></div>
                  {payMethod === p.val && <span className="pm-tick">✓</span>}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="co-right">
          <div className="co-summary">
            <div className="sum-head"><h2>Đơn hàng</h2><span className="sum-badge">{cartItems.length} sản phẩm</span></div>
            <div className="sum-items">
              {cartItems.map((it, i) => (
                <div key={i} className="sum-item">
                  <div className="sii"><span className="sin">{it.name}</span>{it.selectedVariantName && <span className="siv">{it.selectedVariantName}</span>}<span className="siq">× {it.quantity}</span></div>
                  <span className="sip">{fmt(parse(it.currentPrice) * it.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="sum-totals">
              <div className="srow"><span>Tạm tính</span><span>{fmt(finalSub)}</span></div>
              <div className="srow"><span>Phí vận chuyển</span>{renderShip()}</div>
              {appliedVoucher && <div className="srow disc"><span>Voucher <b>{appliedVoucher.code}</b></span><span>−{fmt(discountAmount)}</span></div>}
              <div className="srow total-row"><span>Tổng cộng</span><div className="total-val"><span className="total-num">{fmt(finalTotal)}</span>{isContact && <span className="total-extra">+ phí vận chuyển</span>}</div></div>
            </div>
            <div className="ship-ref">
              <div className="ship-ref-title">📦 Bảng phí vận chuyển</div>
              {TIERS.map((t, i) => (
                <div key={i} className={`ship-ref-row ${deliveryInfo?.tier.id === t.id ? 'active' : ''}`}>
                  <span className="ship-ref-km">{i === 0 ? '≤ 5 km' : i === TIERS.length - 1 ? '> 100 km' : `${TIERS[i - 1].maxKm}–${t.maxKm} km`}</span>
                  <span className="ship-ref-fee">{t.fee === null ? 'Liên hệ' : t.fee === 0 ? 'Miễn phí' : fmt(t.fee)}</span>
                </div>
              ))}
            </div>
            <button type="submit" className="btn-place">XÁC NHẬN ĐẶT HÀNG</button>
            <button type="button" className="btn-goback" onClick={() => navigate('/cart')}>← Quay lại giỏ hàng</button>
          </div>
        </div>
      </form>
    </div>
  );
}