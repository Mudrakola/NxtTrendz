import './index.css'

const SimilarProductItem = props => {
  const {eachProd} = props
  const {imageUrl, title, price, brand, rating} = eachProd
  return (
    <li className="product-similar-container">
      <img
        src={imageUrl}
        className="similar-image"
        alt={`similar product ${title}`}
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="rating-reviews-container three">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
