// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VacciationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiComponentStatus = {
  inprogress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class CowinDashboard extends Component {
  state = {
    fetchedData: {},
    displayStatus: apiComponentStatus.initial,
  }

  componentDidMount() {
    this.fetchedDataApi()
  }

  fetchedDataApi = async () => {
    this.setState({displayStatus: apiComponentStatus.inprogress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const updateData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vacciationByGender: data.vaccination_by_gender,
      }
      this.setState({
        fetchedData: updateData,
        displayStatus: apiComponentStatus.success,
      })
    } else {
      this.setState({
        displayStatus: apiComponentStatus.failure,
      })
    }
  }

  renderPycharts = () => {
    const {fetchedData} = this.state
    const {last7DaysVaccination, vacciationByGender, vaccinationByAge} =
      fetchedData

    return (
      <>
        <VaccinationCoverage vaccinationData={last7DaysVaccination} />
        <VacciationByGender vaccinationByGenderData={vacciationByGender} />
        <VaccinationByAge vaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-container"
      />
      <h1 className="failure-view-text">Something went wrong</h1>
    </div>
  )

  switchcaseCheck = () => {
    const {displayStatus} = this.state
    switch (displayStatus) {
      case apiComponentStatus.success:
        return this.renderPycharts()
      case apiComponentStatus.inprogress:
        return this.loadingView()
      case apiComponentStatus.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="page-container">
        <div className="page-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <p className="logo-text">Co-WIN</p>
        </div>
        <h1 className="page-heading">CoWIN Vaccination in India</h1>
        <div className="chats-container">{this.switchcaseCheck()}</div>
      </div>
    )
  }
}

export default CowinDashboard
