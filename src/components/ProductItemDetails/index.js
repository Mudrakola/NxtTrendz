import {Component} from 'react'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import SimilarProductItem from '../SimilarProductItem'

import Header from '../Header'

import './index.css'

const initialStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetail: {},
    specificProduct: [],
    apiStatus: initialStatusConstant.initial,
    count: 1,
  }

  componentDidMount() {
    this.getSpecificProducts()
  }

  getProductDetail = data1 => ({
    id: data1.id,
    imageUrl: data1.image_url,
    title: data1.title,
    price: data1.price,
    description: data1.description,
    totalReviews: data1.total_reviews,
    rating: data1.rating,
    availability: data1.availability,
    brand: data1.brand,
  })

  getSpecificProducts = async () => {
    this.setState({apiStatus: initialStatusConstant.inProgress})
    const {match} = this.props
    const jwtToken = Cookies.get('jwt_token')
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const fetchedData = this.getProductDetail(data)
      const updatedData = data.similar_products.map(eachItem =>
        this.getProductDetail(eachItem),
      )
      this.setState({
        productDetail: fetchedData,
        specificProduct: updatedData,
        apiStatus: initialStatusConstant.success,
      })
    } else if (response.status === 404) {
      this.renderFailureView(response.error_msg)
      this.setState({apiStatus: initialStatusConstant.failure})
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  clickContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="error-message1">Product Not Found</h1>
      <button
        type="button"
        className="continue-button"
        onClick={this.clickContinue}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderDetail = () => {
    const {productDetail, specificProduct, count} = this.state
    return (
      <div className="products-item-bg-container">
        <div className="product-image-container">
          <img
            src={productDetail.imageUrl}
            className="specific-product-image"
            alt="product"
          />
          <div>
            <h1 className="title-head">{productDetail.title}</h1>
            <p className="amount">Rs {productDetail.price}/-</p>
            <div className="rating-reviews-container">
              <div className="rating-container two">
                <p className="rating">{productDetail.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p>{productDetail.totalReviews} Reviews</p>
            </div>
            <p className="description">{productDetail.description}</p>

            <div className="availability-contain">
              <p className="available">Available:</p>
              <p className="availability">{productDetail.availability}</p>
            </div>
            <div className="availability-contain">
              <p className="available">Brand:</p>
              <p className="availability">{productDetail.brand}</p>
            </div>
            <hr />
            <div className="buttons-container">
              <button
                type="button"
                className="add-sub-button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="icons" />
              </button>
              <p className="no-of-items">{count}</p>
              <button
                type="button"
                className="add-sub-button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="icons" />
              </button>
            </div>
            <button type="button" className="add-to-cart">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="bottom-container">
          <h1 className="similar-product-heading">Similar Products</h1>
          <ul className="similar-products-bottom-container">
            {specificProduct.map(eachProd => (
              <SimilarProductItem eachProd={eachProd} key={eachProd.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductDetail = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case initialStatusConstant.success:
        return this.renderDetail()
      case initialStatusConstant.failure:
        return this.renderFailureView()
      case initialStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderProductDetail()}
      </div>
    )
  }
}

export default ProductItemDetails
