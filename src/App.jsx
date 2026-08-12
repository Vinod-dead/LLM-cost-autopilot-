import { Navigation } from './components/Navigation'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { CTASection } from './components/CTASection'
import { Footer } from './components/Footer'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default App