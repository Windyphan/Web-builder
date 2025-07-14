import Header from '../components/Header';
import About from '../components/About';
import Team from '../components/Team';
import TrustedClients from '../components/TrustedClients';
import Footer from '../components/Footer';

function AboutPage() {
    return (
        <div className="min-h-screen">
            <Header />
            <About />
            <Team />
            <TrustedClients />
            <Footer />
        </div>
    );
}

export default AboutPage;