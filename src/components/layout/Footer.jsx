import React from "react"
import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  const today = new Date()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer style={{ backgroundColor: '#0057B7', color: '#fff', position: 'relative' }}>
      {/* Scroll to Top Button */}
      <div
        className="scroll-totop"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#0057B7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
        >
          <img
            src="https://toscanavalley.com/wp-content/themes/toscanavalley/assets/images/footer/arrow-top.png"
            alt="Scroll to top"
            style={{ width: '20px', height: '20px' }}
          />
        </div>
      </div>


      <Container className="py-4">
        <Row>
          <Col md={4} className="mb-4">
            <a href="javascript:void(0);">
              <h5 style={{ fontWeight: 'bold', color: '#fff', textDecoration: 'none' }}>Love Hotel</h5>
            </a>
            <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: '1.5' }}>
              123/45 Thanon Sooksan ,<br />
              Kwang Bang-wa, Khet Bang-wa,<br />
              Krung Thep Maha Nakhon 10160
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <h5 style={{ fontWeight: 'bold' }}>Social</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Instagram</a></li>
              <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Facebook</a></li>
              <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Tik Tok</a></li>
              <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Youtube</a></li>
              <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Line</a></li>
            </ul>
          </Col>

          {/* Links & Contact */}
          <Col md={4} className="mb-4">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Links */}
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Links</h5>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Activities</a></li>
                  <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Spa</a></li>
                  <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Events</a></li>
                  <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Location</a></li>
                  <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Toscana News</a></li>
                </ul>
              </div>
              {/* Contact */}
              <div>
                <h5 style={{ fontWeight: 'bold' }}>Contact</h5>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</a></li>
                  <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Job Opening</a></li>
                  <li><a href="" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Terms & Policies</a></li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Copyright */}
      <div style={{
        backgroundColor: '#0057B7',
        padding: '10px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="https://toscanavalley.com/wp-content/themes/toscanavalley/assets/images/footer/copyright.png"
          alt="copyright"
          style={{ width: '20px', height: '20px', marginRight: '8px' }}
        />
        <span>&copy; {today.getFullYear()} Love Hotel</span>
      </div>
    </footer>
  )
}

export default Footer