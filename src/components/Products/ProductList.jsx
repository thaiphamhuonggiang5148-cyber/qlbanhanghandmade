import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { imageMap } from "../../utils/productImages";
import "./ProductList.css";

const PRODUCTS_PER_PAGE = 9;
const jsonBase = import.meta.env.BASE_URL || "/";

const BRANDS = [
  "Vicem", "Hà Tiên", "Holcim", "INSEE", "Nghi Sơn",
  "Hòa Phát", "Pomina", "VAS", "Dulux", "Jotun",
  "Nippon", "Kova", "Sika", "Cadivi", "Sino Schneider",
  "Tiền Phong", "TOTO", "Inax", "Caesar", "Hafele", "Grohe", "Teka",
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const categoryQuery = searchParams.get("category");
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxCatalogPrice, setMaxCatalogPrice] = useState(0);
  const [maxPriceFilter, setMaxPriceFilter] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const [openGroups, setOpenGroups] = useState({
    categories: true,
    brands: true,
    status: true,
    price: true,
  });

  const toggleGroup = (group) =>
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${jsonBase}ProductS.json`),
          fetch(`${jsonBase}Category.json`),
        ]);
        if (!productsRes.ok) throw new Error("Không thể tải dữ liệu");

        const data = await productsRes.json();
        const mappedProducts = data.map((item) => {
          const rawPrice = item.currentPrice || String(item.price || "0");
          return {
            ...item,
            image: imageMap[item.imageKey] || item.image,
            priceNum: parseInt(rawPrice.replace(/\D/g, ""), 10) || 0,
          };
        });

        const maxPrice = Math.max(...mappedProducts.map((p) => p.priceNum), 0);
        setMaxCatalogPrice(maxPrice);
        setMaxPriceFilter(maxPrice);
        setAppliedMaxPrice(maxPrice);
        setProducts(mappedProducts);

        if (categoriesRes.ok) {
          const catData = await categoriesRes.json();
          setCategories(Array.isArray(catData) ? catData : []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryQuery, searchQuery]);

  const handleCategoryClick = (id) => {
    if (id) navigate(`/product?category=${id}`);
    else navigate("/product");
  };

  const removeSearch = () => {
    const newParams = new URLSearchParams(location.search);
    newParams.delete("search");
    navigate(`/product?${newParams.toString()}`);
  };

  const removeBrand = (brand) => {
    setSelectedBrands((prev) => prev.filter((b) => b !== brand));
    setCurrentPage(1);
  };

  const applyPriceFilter = () => {
    setAppliedMaxPrice(maxPriceFilter);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setMaxPriceFilter(maxCatalogPrice);
    setAppliedMaxPrice(maxCatalogPrice);
    setOnSaleOnly(false);
    setCurrentPage(1);
    navigate("/product");
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (categoryQuery)
      result = result.filter(
        (p) => String(p.categoryid) === String(categoryQuery)
      );

    if (searchQuery) {
      const query = searchQuery.normalize("NFC");
      result = result.filter((p) => {
        const inName =
          p.name && p.name.toLowerCase().normalize("NFC").includes(query);
        const inDesc =
          p.description &&
          p.description.toLowerCase().normalize("NFC").includes(query);
        const inSpecs =
          p.specs &&
          Object.values(p.specs).some((val) =>
            String(val).toLowerCase().normalize("NFC").includes(query)
          );
        return inName || inDesc || inSpecs;
      });
    }

    if (selectedBrands.length > 0) {
      result = result.filter((p) => {
        const productBrand = (
          p.specs?.["Thương hiệu"] || ""
        ).toLowerCase().normalize("NFC");
        return selectedBrands.some((b) =>
          productBrand.includes(b.toLowerCase().normalize("NFC"))
        );
      });
    }

    result = result.filter((p) => p.priceNum <= appliedMaxPrice);

    if (onSaleOnly)
      result = result.filter((p) => p.discount && p.discount !== "0%");

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.priceNum - b.priceNum);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceNum - a.priceNum);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    categoryQuery,
    searchQuery,
    selectedBrands,
    appliedMaxPrice,
    onSaleOnly,
    sortOption,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = filteredAndSortedProducts.slice(
    start,
    start + PRODUCTS_PER_PAGE
  );
  const safeMax = maxCatalogPrice || 100;

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    appliedMaxPrice < maxCatalogPrice ||
    onSaleOnly ||
    searchQuery;

  const activeFilterCount =
    selectedBrands.length +
    (appliedMaxPrice < maxCatalogPrice ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  /* ── Numbered pagination ── */
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("…");
      const s = Math.max(2, safePage - 1);
      const e = Math.min(totalPages - 1, safePage + 1);
      for (let i = s; i <= e; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  const currentCategoryName = categories.find(
    (c) => String(c.id) === String(categoryQuery)
  )?.name;

  /* ── States ── */
  if (isLoading)
    return (
      <div className="pl-container">
        <div className="pl-loading">
          <div className="pl-loading-spinner" />
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="pl-container">
        <div className="pl-error">
          <i className="fas fa-exclamation-triangle" />
          <p>Lỗi: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="pl-container">
      {/* ── Page Header ── */}
      <div className="pl-page-header">
        <h1 className="pl-page-title">
          {currentCategoryName ||
            (searchQuery ? "Kết Quả Tìm Kiếm" : "Tất Cả Sản Phẩm")}
        </h1>
        {searchQuery && (
          <p className="pl-search-subtitle">
            Từ khóa: <strong>"{searchQuery}"</strong>
            <button className="pl-remove-search" onClick={removeSearch}>
              <i className="fas fa-times" />
            </button>
          </p>
        )}
      </div>

      {/* ── Mobile Filter Toggle ── */}
      <button
        className={`pl-mobile-filter-btn ${mobileSidebarOpen ? "active" : ""}`}
        onClick={() => setMobileSidebarOpen((v) => !v)}
      >
        <i className="fas fa-sliders-h" />
        Bộ Lọc
        {activeFilterCount > 0 && (
          <span className="pl-filter-badge">{activeFilterCount}</span>
        )}
      </button>

      <div className="pl-layout">
        {/* ════════════ SIDEBAR ════════════ */}
        <aside className={`pl-sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>
          <div className="pl-sidebar-header">
            <span className="pl-sidebar-title">
              <i className="fas fa-filter" />
              Bộ Lọc
            </span>
            {hasActiveFilters && (
              <button className="pl-clear-all" onClick={clearFilters}>
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Danh Mục */}
          <div className="pl-filter-group">
            <div
              className={`pl-filter-title ${!openGroups.categories ? "collapsed" : ""}`}
              onClick={() => toggleGroup("categories")}
            >
              <span>Danh Mục</span>
              <i className="fas fa-chevron-down" />
            </div>
            <div
              className={`pl-filter-content ${!openGroups.categories ? "collapsed" : ""}`}
            >
              <div className="pl-checkbox-list">
                <label className="pl-checkbox-label">
                  <input
                    type="radio"
                    name="categoryGroup"
                    checked={!categoryQuery}
                    onChange={() => handleCategoryClick(null)}
                  />
                  <div className="pl-radio-custom" />
                  <span>Tất cả sản phẩm</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="pl-checkbox-label">
                    <input
                      type="radio"
                      name="categoryGroup"
                      checked={String(categoryQuery) === String(cat.id)}
                      onChange={() => handleCategoryClick(cat.id)}
                    />
                    <div className="pl-radio-custom" />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Thương Hiệu */}
          <div className="pl-filter-group">
            <div
              className={`pl-filter-title ${!openGroups.brands ? "collapsed" : ""}`}
              onClick={() => toggleGroup("brands")}
            >
              <span>Thương Hiệu</span>
              {selectedBrands.length > 0 && (
                <span className="pl-group-badge">{selectedBrands.length}</span>
              )}
              <i className="fas fa-chevron-down" />
            </div>
            <div
              className={`pl-filter-content ${!openGroups.brands ? "collapsed" : ""}`}
            >
              <div className="pl-checkbox-list">
                {BRANDS.map((brand) => (
                  <label key={brand} className="pl-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => {
                        setSelectedBrands((prev) =>
                          prev.includes(brand)
                            ? prev.filter((b) => b !== brand)
                            : [...prev, brand]
                        );
                        setCurrentPage(1);
                      }}
                    />
                    <div className="pl-checkbox-custom">
                      <i className="fas fa-check" />
                    </div>
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tình Trạng */}
          <div className="pl-filter-group">
            <div
              className={`pl-filter-title ${!openGroups.status ? "collapsed" : ""}`}
              onClick={() => toggleGroup("status")}
            >
              <span>Tình Trạng</span>
              <i className="fas fa-chevron-down" />
            </div>
            <div
              className={`pl-filter-content ${!openGroups.status ? "collapsed" : ""}`}
            >
              <div className="pl-checkbox-list">
                <label className="pl-checkbox-label">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => {
                      setOnSaleOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                  />
                  <div className="pl-checkbox-custom">
                    <i className="fas fa-check" />
                  </div>
                  <span>Đang giảm giá</span>
                </label>
                <label className="pl-checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <div className="pl-checkbox-custom">
                    <i className="fas fa-check" />
                  </div>
                  <span>Còn hàng</span>
                </label>
              </div>
            </div>
          </div>

          {/* Giá */}
          <div className="pl-filter-group">
            <div
              className={`pl-filter-title ${!openGroups.price ? "collapsed" : ""}`}
              onClick={() => toggleGroup("price")}
            >
              <span>Giá Sản Phẩm</span>
              <i className="fas fa-chevron-down" />
            </div>
            <div
              className={`pl-filter-content ${!openGroups.price ? "collapsed" : ""}`}
            >
              <div className="pl-price-range-labels">
                <span>0₫</span>
                <span className="pl-price-max-label">
                  {maxCatalogPrice.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="pl-price-slider-wrap">
                <div
                  className="pl-slider-track-active"
                  style={{ width: `${(maxPriceFilter / safeMax) * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={maxCatalogPrice}
                  step="1000"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                />
              </div>
              <div className="pl-price-display">
                Tối đa:{" "}
                <strong>{maxPriceFilter.toLocaleString("vi-VN")}₫</strong>
              </div>
              <button
                className={`pl-price-btn ${maxPriceFilter !== appliedMaxPrice ? "has-change" : ""}`}
                onClick={applyPriceFilter}
              >
                {maxPriceFilter !== appliedMaxPrice ? "Áp dụng ngay" : "Áp dụng"}
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop (mobile) */}
        {mobileSidebarOpen && (
          <div
            className="pl-sidebar-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* ════════════ MAIN ════════════ */}
        <div className="pl-main">
          {/* Topbar */}
          <div className="pl-topbar">
            <div className="pl-result-count">
              {filteredAndSortedProducts.length > 0 ? (
                <>
                  Hiển thị{" "}
                  <strong>
                    {start + 1}–
                    {Math.min(
                      start + PRODUCTS_PER_PAGE,
                      filteredAndSortedProducts.length
                    )}
                  </strong>{" "}
                  trong{" "}
                  <strong>{filteredAndSortedProducts.length}</strong> sản phẩm
                </>
              ) : (
                <span>Không tìm thấy sản phẩm</span>
              )}
            </div>

            <div className="pl-sort-wrap">
              <label>Sắp xếp:</label>
              <div className="pl-sort-select-wrap">
                <select
                  className="pl-sort-select"
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="default">Mặc định</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                </select>
                <i className="fas fa-chevron-down pl-sort-arrow" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="pl-active-filters">
              {searchQuery && (
                <div className="pl-filter-chip search-chip">
                  <i className="fas fa-search" />
                  <span>"{searchQuery}"</span>
                  <button onClick={removeSearch}>
                    <i className="fas fa-times" />
                  </button>
                </div>
              )}
              {selectedBrands.map((brand) => (
                <div key={brand} className="pl-filter-chip brand-chip">
                  <span>{brand}</span>
                  <button onClick={() => removeBrand(brand)}>
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
              {appliedMaxPrice < maxCatalogPrice && (
                <div className="pl-filter-chip price-chip">
                  <i className="fas fa-tag" />
                  <span>Max {appliedMaxPrice.toLocaleString("vi-VN")}₫</span>
                  <button
                    onClick={() => {
                      setMaxPriceFilter(maxCatalogPrice);
                      setAppliedMaxPrice(maxCatalogPrice);
                      setCurrentPage(1);
                    }}
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              )}
              {onSaleOnly && (
                <div className="pl-filter-chip sale-chip">
                  <i className="fas fa-percent" />
                  <span>Đang giảm giá</span>
                  <button onClick={() => setOnSaleOnly(false)}>
                    <i className="fas fa-times" />
                  </button>
                </div>
              )}
              <button className="pl-clear-filters-link" onClick={clearFilters}>
                <i className="fas fa-times-circle" /> Xóa tất cả
              </button>
            </div>
          )}

          {/* Grid or Empty */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="pl-empty">
              <div className="pl-empty-icon">
                <i className="fas fa-box-open" />
              </div>
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p>Thử thay đổi hoặc xóa bớt bộ lọc để xem thêm sản phẩm.</p>
              <button onClick={clearFilters} className="pl-empty-btn">
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="pl-products-grid">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pl-pagination">
                  <button
                    className="pl-page-btn pl-page-nav"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    aria-label="Trang trước"
                  >
                    <i className="fas fa-chevron-left" />
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === "…" ? (
                      <span key={`ellipsis-${idx}`} className="pl-page-ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`pl-page-btn ${safePage === page ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    className="pl-page-btn pl-page-nav"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safePage >= totalPages}
                    aria-label="Trang sau"
                  >
                    <i className="fas fa-chevron-right" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;