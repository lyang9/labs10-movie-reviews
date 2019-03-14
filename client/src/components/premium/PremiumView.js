import React, { Component } from 'react';
import './premium.css';
import PremiumCard from './PremiumCard';
import axios from 'axios';
import { currentUser, users } from '../../services/userURLs';
import { placeholderUrl } from '../../services/resourceURLs';
import { customerDelete, customerPlan } from '../../services/paymentURLs';

class PremiumView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      email: '',
      name: '',
      photo: '',
      stripeId: '',
      premium: false,
      subType: ''
    };
  }

  componentDidMount = async () => {
    // check if user already logging in or not
    const userRes = await axios.get(currentUser, {
      withCredentials: true
    });

    if (!userRes.data) {
      console.log(userRes.error);
      return;
    }

    const { id, photo, email, name, stripeId } = userRes.data;
    console.log(userRes.data);
    if (!stripeId) {
      console.log('I have not subscribed yet');
      this.setState({ id, photo, email, name });
    } else {
      this.handleLoadSubType(stripeId, userRes.data);
    }
  };

  handleCompleteSuccessfulPayment = stripeId => {
    const { id, photo, email, name } = this.state;
    this.handleLoadSubType(stripeId, { id, photo, email, name });
  };

  handleLoadSubType = (stripeId, currentUser) => {
    axios
      .post(customerPlan, {
        stripeId
      })
      .then(planRes => {
        if (planRes.data.premium) {
          this.setState({
            ...currentUser,
            stripeId,
            premium: planRes.data.customer.active,
            subType: planRes.data.customer.nickname
          });
        }
      })
      .catch(error => {
        this.setState({
          ...currentUser,
          stripeId: null,
          premium: false,
          subType: ''
        });
      });
  };

  handleCancel = async id => {
    const updateUserStripeIdRes = await axios.put(`${users}/${id}`, {
      stripeId: ''
    });

    if (updateUserStripeIdRes.status === 200) {
      const cancellationRes = await axios.post(customerDelete, {
        stripeid: this.state.stripeId
      });

      if (cancellationRes.data.deleted) {
        this.setState({
          premium: false,
          subType: '',
          stripeId: ''
        });
      }
    }
  };

  render() {
    console.log('this state', this.state);
    return (
      <div className="container bg-custom top-padding">
        <div className="row">
          <div className="col-md-4">
            <div className="placeholder">
              <a href={`${placeholderUrl}`}>
                <img
                  className="premium-avatar img-responsive mb-3"
                  src={this.state.photo}
                  alt="avatar"
                />
              </a>

              <ul className="list-group">
                <li className="bg-custom border-none">
                  <h5>
                  <span className="badge badge-light">Status:</span>
                  <span>
                    {this.state.premium ? (
                      <h3 className="badge badge-info">Premium</h3>
                    ) : (
                      <h3 className="badge badge-secondary">Standard</h3>
                    )}
                  </span>
                  </h5>
                </li>

                <li className="bg-custom">
                  <h5>
                  <span className="badge badge-light">Name:</span>
                  <span className="badge badge-light">{this.state.name}</span>
                  </h5>
                </li>

                {/* <li className="mt-3 bg-custom">
                  <span className="small badge badge-light mr-1">Email:</span>
                  <span className="badge badge-light">{this.state.email}</span>
                </li> */}

                {this.state.premium ? (
                  <>
                    <li className="bg-custom">
                      <h5>
                      <span className="badge badge-light">
                        Subscription:{''}
                      </span>
                      <span className="badge badge-light">
                        {this.state.subType}
                      </span>
                      </h5>
                    </li>

                    <li className="bg-custom">
                      <h5>
                      <span className="badge badge-light">
                        Billing Amount:{''}
                      </span>
                      <span className="badge badge-light">
                        {this.state.subType === 'Yearly' ? '$9.99' : '$0.99'}
                      </span>
                      </h5>
                    </li>

                    <li className="bg-custom">
                      <button
                        type="button"
                        className="btn btn-small text-danger text-left delete-button"
                        onClick={() => this.handleCancel(this.state.id)}
                      >
                        <span className="small">
                          <p>Cancel Subscription</p>
                        </span>
                      </button>
                    </li>
                  </>
                ) : null}
              </ul>
            </div>
          </div>

          <div className="col-md-8 mb-5">
            {!this.state.premium ? (
              <h3 className="font-weight-light">Premium Subscriptions</h3>
            ) : this.state.subType === 'Yearly' ? (
              <h3 className="font-weight-light text-center">
                Yearly Premium
              </h3>
            ) : (
              <h3 className="font-weight-light text-center">
                Monthly Premium
              </h3>
            )}

            <div className="row">
              {!this.state.premium ? (
                <>
                  <div className="col-md-6">
                    <PremiumCard
                      header={'Yearly Subscription'}
                      priceTitle={'$9.99'}
                      description={
                        'Enjoy the benefits of being a Premium Member.Write reviews on any movie from A Trip To The Moon to your box office favorite. Rate each film on a five-star scale to record and share your reaction. Keep a diary of the films you have seen and share your thoughts on them with others in the CineView community!'
                      }
                      totalCents={999}
                      currentUser={this.state}
                      onCompleteSuccessfulPayment={
                        this.handleCompleteSuccessfulPayment
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <PremiumCard
                      header={'Monthly Subscription'}
                      priceTitle={'$0.99'}
                      description={
                        'Enjoy the benefits of being a Premium Member.Write reviews on any movie from A Trip To The Moon to your box office favorite. Rate each film on a five-star scale to record and share your reaction. Keep a diary of the films you have seen and share your thoughts on them with others in the CineView community!'
                      }
                      totalCents={99}
                      currentUser={this.state}
                      onCompleteSuccessfulPayment={
                        this.handleCompleteSuccessfulPayment
                      }
                    />
                  </div>
                </>
              ) : this.state.subType === 'Yearly' ? (
                <>
                  <div className="col-md-6">
                    <PremiumCard
                      header={'Yearly Subscription'}
                      priceTitle={'$9.99'}
                      description={
                        'Enjoy the benefits of being a Premium Member.Write reviews on any movie from A Trip To The Moon to your box office favorite. Rate each film on a five-star scale to record and share your reaction. Keep a diary of the films you have seen and share your thoughts on them with others in the CineView community!'
                      }
                      totalCents={999}
                      displayNone="displayNone"
                      currentSub="Yearly"
                      premium={this.state.premium}
                      currentUser={this.state}
                      onCompleteSuccessfulPayment={
                        this.handleCompleteSuccessfulPayment
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <PremiumCard
                      header={'Monthly Subscription'}
                      priceTitle={'$0.99'}
                      description={
                        'Enjoy the benefits of being a Premium Member.Write reviews on any movie from A Trip To The Moon to your box office favorite. Rate each film on a five-star scale to record and share your reaction. Keep a diary of the films you have seen and share your thoughts on them with others in the CineView community!'
                      }
                      totalCents={99}
                      displayNone="displayNone"
                      premium={this.state.premium}
                      currentUser={this.state}
                      onCompleteSuccessfulPayment={
                        this.handleCompleteSuccessfulPayment
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-6 subscribed">
                    <PremiumCard
                      header={'Yearly Subscription'}
                      priceTitle={'$9.99'}
                      description={
                        'Enjoy the benefits of being a Premium Member.Write reviews on any movie from A Trip To The Moon to your box office favorite. Rate each film on a five-star scale to record and share your reaction. Keep a diary of the films you have seen and share your thoughts on them with others in the CineView community!'
                      }
                      totalCents={999}
                      displayNone="displayNone"
                      premium={this.state.premium}
                      currentUser={this.state}
                    />
                  </div>

                  <div className="col-md-6 subscribed">
                    <PremiumCard
                      header={'Monthly Subscription'}
                      priceTitle={'$0.99'}
                      description={
                        'Enjoy the benefits of being a Premium Member.Write reviews on any movie from A Trip To The Moon to your box office favorite. Rate each film on a five-star scale to record and share your reaction. Keep a diary of the films you have seen and share your thoughts on them with others in the CineView community!'
                      }
                      totalCents={99}
                      displayNone="displayNone"
                      currentSub="Monthly"
                      premium={this.state.premium}
                      currentUser={this.state}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PremiumView;
