import React, { Component } from 'react';
import Aux from '../../hoc/AuxComponent/AuxComponent';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount(){
    axios.get('https://burgerbuilder-3e3a8.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ingredients: response.data})
      })
      .catch(error => {
        this.setState({error: true})
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    this.setState({purchasable: sum > 0})
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    const updatedCount = oldCount + 1
    const updatedIngredients = {
      ...this.state.ingredients,
    }
    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    const updatedCount = oldCount - 1;
    if(oldCount <= 0){
      return;
    }
    const updatedIngredients = {
      ...this.state.ingredients,
    }
    updatedIngredients[type] = updatedCount;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true})
  };

  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  };

  purchaseContinueHandler = () => {
    this.setState({loading: true})
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Pesho',
        address: {
          street: 'TestStreet 1',
          city: 'Sofia',
          country: 'Bulgaria'
        },
        email: 'test@email.com'
      },
      deliveryMethod: 'fastest'
    }
     axios.post('/orders.json', order)
       .then(response => {
         this.setState({loading: false, purchasing: false})
       })
       .catch(error => {
         this.setState({loading: false, purchasing: false})
       });

    const queryparams = [];
    for(let i in this.state.ingredients){
      queryparams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
    }

    const queryString = queryparams.join('&');

    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    });
  };

  render () {
    const disableInfo = {
      ...this.state.ingredients
    }

    for (let key in disableInfo){
      disableInfo[key] = disableInfo[key] <= 0
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients cant be loaded!</p> : <Spinner />;
    if(this.state.ingredients){
      burger =  (
        <Aux>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disableInfo}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}
            purchasable={this.state.purchasable}/>
        </Aux>);

      orderSummary =  <OrderSummary
        ingredients={this.state.ingredients}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        price={this.state.totalPrice}
      />
    }

    if(this.state.loading){
      orderSummary = <Spinner />
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios);