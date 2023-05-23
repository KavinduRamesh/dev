import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "../Rating";
import axios from "axios";
import { useContext, useState } from "react";
import { Store } from "../../Store";
import "../products/Product.css";

function Product(props) {
  const { product } = props;
  const [isChecked, setIsChecked] = useState(false);
  const [checkedProducts, setCheckedProducts] = useState([]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <div>
      <Card className="card-container">
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            className="card-img-top card-img"
            alt={product.name}
          />
        </Link>
        <Card.Body className="card-body">
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <div className="product-info">
            <Link to={`/product/${product.slug}`}>
              <Card.Title className="card-font-product-name">
                {product.name}
              </Card.Title>
            </Link>
            <Card.Text className="card-card-font-product-price">
              LKR. {product.price}
            </Card.Text>
          </div>

          {product.countInStock === 0 ? (
            <Button className="product-btn" variant="light" disabled>
              Out of stock
            </Button>
          ) : (
            <Button
              className="product-btn"
              onClick={() => addToCartHandler(product)}
            >
              Add to cart
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
export default Product;
