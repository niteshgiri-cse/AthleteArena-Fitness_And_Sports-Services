import React from 'react'
import HomePage from './HomePage'
import AboutUs from './AboutUs'
import Services from '../Services/Services'
import Navbar from '@/components/layout/Navbar'


const Home = () => {
  return (
    <div>
        <HomePage/>
        <Services/>
        <AboutUs/>
    </div>
  )
}

export default Home