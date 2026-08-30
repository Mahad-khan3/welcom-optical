export default function CollectionBanner({ category, image, mobileImage, plain }) {
  if (!category) return null

  const bannerImage = image || category.image
  const mobile = mobileImage || bannerImage

  if (plain) {
    return (
      <section className="collection-banner collection-banner--plain">
        <picture>
          {mobile !== bannerImage && <source media="(max-width: 767px)" srcSet={mobile} />}
          <img src={bannerImage} alt={category.name} loading="eager" />
        </picture>
      </section>
    )
  }

  return (
    <section className="collection-banner">
      {bannerImage && (
        <div className="collection-banner-bg">
          <img src={bannerImage} alt={category.name} loading="eager" />
          <div className="collection-banner-overlay" />
        </div>
      )}
      <div className="collection-banner-content">
        <p className="section-kicker">The Collection</p>
        <h1>{category.name}</h1>
        {category.description && <p className="collection-banner-desc">{category.description}</p>}
        {category.productCount ? (
          <span className="collection-banner-count">
            {category.productCount} {category.productCount === 1 ? 'piece' : 'pieces'}
          </span>
        ) : null}
      </div>
    </section>
  )
}