import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import $ from 'jquery';

const Handle = Slider.Handle;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recent_data: [],
      actual_data: [],
      isRecentDataAvailable: false,
      amount_slider: '',
      duration_slider: '',
      isFetch: false,
      InterestRate: 0,
      monthlyPayment: 0,
      isOutputReady: 'none'
    }
  }

  componentDidMount() {
    var recent_data = window.localStorage.getItem('interestRates_cache');
    var parsed_data = JSON.parse(recent_data);
    if (recent_data !== null) {
      this.setState({ recent_data: parsed_data, isRecentDataAvailable: true });
    } else {
      this.setState({ recent_data: [null] });
    }
  }

  event_handler(index) {
    var amount = $("[data-index=" + index + "] p:nth-child(1)").attr('data-amount');
    var duration = $("[data-index=" + index + "] p:nth-child(2)").attr('data-duration');
    this.state_updater(amount, duration);
  }

  state_updater(amount, duration) {
    this.setState({ amount_slider: Number(amount), duration_slider: Number(duration), isFetch: 'cache', isOutputReady:'none' });
  }

  async componentDidUpdate() {
    const { recent_data, isFetch, amount_slider, duration_slider } = this.state;
    var recent_data_tmp = recent_data;
    if (amount_slider !== '' && duration_slider !== '' && isFetch !== false) {
      var isFormValidated_amount = false;
      var isFormValidated_duration = false;
      if (5000 >= amount_slider && amount_slider >= 500) {
        $('.field-input .amount-form .invalid-feedback').hide();
        isFormValidated_amount = true;
      } else {
        $('.field-input .amount-form .invalid-feedback').show();
        isFormValidated_amount = false;
        this.setState({ isOutputReady: 'none', isFetch: false });
      }
      if (24 >= duration_slider && duration_slider >= 6) {
        $('.field-input .duration-form .invalid-feedback').hide();
        isFormValidated_duration = true;
      } else {
        $('.field-input .duration-form .invalid-feedback').show();
        isFormValidated_duration = false;
        this.setState({ isOutputReady: 'none', isFetch: false });
      }
      if (isFormValidated_amount === true && isFormValidated_duration === true) {
        var new_cache = { amount: amount_slider, duration: duration_slider };
        if (isFetch !== 'cache') {
          recent_data_tmp.unshift(new_cache);
        }
        await fetch(`https://ftl-frontend-test.herokuapp.com/interest?amount=${amount_slider}&numMonths=${duration_slider}`).then(data => data.json())
          .then((data) => {
            this.setState({
              interestRate: data.interestRate,
              monthlyPayment: data.monthlyPayment.amount,
              isFetch: false,
              isOutputReady: 'flex',
              recent_data: recent_data_tmp,
              isRecentDataAvailable: true,
            }, () => {
              if (isFetch !== 'cache') {
                localStorage.setItem('interestRates_cache', JSON.stringify(recent_data_tmp));
              }
            })
          })
          .catch(function (e) {
            console.log(e);
          });
      }
    }
  }

  input_setter(value, field) {
    if (field === 'amount') {
      this.setState({ amount_slider: value.target.value, isFetch: true, isOutputReady:'none' });
    } else if (field === 'duration') {
      this.setState({ duration_slider: value.target.value, isFetch: true, isOutputReady:'none' });
    } else if (field === 'amount_slider') {
      this.setState({ amount_slider: value, isFetch: true, isOutputReady:'none' });
    } else if (field === 'duration_slider') {
      this.setState({ duration_slider: value, isFetch: true, isOutputReady:'none' });
    }
  }

  render() {

    const { recent_data, isRecentDataAvailable, amount_slider, duration_slider, isOutputReady, interestRate, monthlyPayment } = this.state;

    const window_height = window.innerHeight;

    const handle = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <Tooltip
          prefixCls="rc-slider-tooltip"
          overlay={value}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };
    var recent_search_list = recent_data.map((item, index) => {
      if (isRecentDataAvailable === true && item !== null) {
        return (
          <div key={index} className="recent_item" data-index={index} onClick={this.event_handler.bind(this, index)}>
            <p data-amount={item.amount}>Amount: {item.amount}</p>
            <p data-duration={item.duration}>Duration: {item.duration}</p>
          </div>
        )
      } else if (isRecentDataAvailable === false) {
        return (
          <div key={1} className="recent_item">
            <p> Your recent searches will appear here!</p>
          </div>
        )
      }
    })

    return (
      <div className="App">
        <header className="App-header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 calculator-tab full-height">
                <div className="field-input">
                  <h3 className="head">Interest Rates calculator</h3>
                  <p className="sub-head">Please enter the amount and duration to check the interest rate and EMI</p>
                  <form>
                    <div className="form-group amount-form">
                      <label htmlFor="Amount-input">Amount in $</label>
                      <input type="number" className="form-control" id="Amount-input" placeholder="Enter amount" onChange={(value, field = 'amount') => this.input_setter(value, field)} value={amount_slider} required />
                      <div className="invalid-feedback">
                        Please choose a amount between $ 500 to $ 5000.
                      </div>
                      <Slider min={500} max={5000} defaultValue={1000} handle={handle} onAfterChange={(value, field = 'amount_slider') => this.input_setter(value, field)} />
                    </div>
                    <div className="form-group duration-form">
                      <label htmlFor="Duration-input">Duration in months</label>
                      <input type="number" className="form-control" id="Duration-input" placeholder="Duration" onChange={(value, field = 'duration') => this.input_setter(value, field)} value={duration_slider} required />
                      <div className="invalid-feedback">
                        Please choose a month between 6 to 24.
                      </div>
                      <Slider min={6} max={24} defaultValue={12} handle={handle} onAfterChange={(value, field = 'duration_slider') => this.input_setter(value, field)} />
                    </div>
                  </form>
                </div>
                <div className="field-output col-md-12 row justify-content-md-center" style={{ display: isOutputReady }}>
                  <table className="table col-md-9">
                    <thead>
                      <tr>
                        <th scope="col">Principal Amount</th>
                        <th scope="col">Duration (M)</th>
                        <th scope="col">Interest Rate</th>
                        <th scope="col">Monthly payment ( x {duration_slider})</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>$ {amount_slider}</td>
                        <td>{duration_slider}</td>
                        <td>$ {interestRate}</td>
                        <td>$ {monthlyPayment}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-4 recent-tab full-height" style={{ height: window_height }}>
                <div className="col-md-10 recent-content">
                  <h6>Recent Search list</h6>
                  {recent_search_list}
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    )
  }
}

export default App;
