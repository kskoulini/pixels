import React from 'react';
import { Link } from 'react-router-dom';
import RetroWindow from '../components/RetroWindow';

function Landing() {
    return (
        <RetroWindow title="home-page">
            <div className="landing-wrap page-container">
                <div className="landing-inner">
                    <div className="landing-title">
                        <svg width="27" height="33" viewBox="0 0 27 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26.2239 20.0576H24.6849V27.7729H26.2239V20.0576Z" fill="#3D2817"/>
                            <path d="M24.6849 27.7731H23.1459V29.3222H24.6849V27.7731Z" fill="#3D2817"/>
                            <path d="M24.6849 16.9696H23.1459V20.0577H24.6849V16.9696Z" fill="#3D2817"/>
                            <path d="M23.1458 3.08813H21.5967V16.9696H23.1458V3.08813Z" fill="#3D2817"/>
                            <path d="M23.1459 29.3223H20.0577V30.8613H23.1459V29.3223Z" fill="#3D2817"/>
                            <path d="M21.5967 1.54919H20.0577V3.0882H21.5967V1.54919Z" fill="#3D2817"/>
                            <path d="M20.0577 0H16.9696V1.54913H20.0577V0Z" fill="#3D2817"/>
                            <path d="M20.0577 30.8612H6.17628V32.4002H20.0577V30.8612Z" fill="#3D2817"/>
                            <path d="M18.5187 18.5187H16.9696V20.0577H18.5187V18.5187Z" fill="#3D2817"/>
                            <path d="M20.0577 4.62708H16.9696V13.8915H20.0577V4.62708Z" fill="#3D2817"/>
                            <path d="M16.9696 23.1458H15.4306V24.6848H16.9696V23.1458Z" fill="#3D2817"/>
                            <path d="M16.9696 1.54919H15.4306V3.0882H16.9696V1.54919Z" fill="#3D2817"/>
                            <path d="M15.4306 3.08813H13.8814V15.4306H15.4306V3.08813Z" fill="#3D2817"/>
                            <path d="M15.4306 24.6849H12.3424V26.2341H15.4306V24.6849Z" fill="#3D2817"/>
                            <path d="M12.3424 23.1458H13.8815V21.6067H15.4306V20.0576H10.8034V21.6067H12.3424V23.1458Z" fill="#3D2817"/>
                            <path d="M13.8814 15.4305H12.3424V16.9695H13.8814V15.4305Z" fill="#3D2817"/>
                            <path d="M12.3424 3.08813H10.8034V15.4306H12.3424V3.08813Z" fill="#3D2817"/>
                            <path d="M10.8034 1.54919H9.25429V3.0882H10.8034V1.54919Z" fill="#3D2817"/>
                            <path d="M9.25428 18.5187H7.71527V20.0577H9.25428V18.5187Z" fill="#3D2817"/>
                            <path d="M9.2543 0H6.17628V1.54913H9.2543V0Z" fill="#3D2817"/>
                            <path d="M9.2543 4.62708H6.17628V13.8915H9.2543V4.62708Z" fill="#3D2817"/>
                            <path d="M6.17629 29.3223H3.08815V30.8613H6.17629V29.3223Z" fill="#3D2817"/>
                            <path d="M6.1763 1.54919H4.62717V3.0882H6.1763V1.54919Z" fill="#3D2817"/>
                            <path d="M4.62716 3.08813H3.08815V16.9696H4.62716V3.08813Z" fill="#3D2817"/>
                            <path d="M3.08815 27.7731H1.53902V29.3222H3.08815V27.7731Z" fill="#3D2817"/>
                            <path d="M3.08815 16.9696H1.53902V20.0577H3.08815V16.9696Z" fill="#3D2817"/>
                            <path d="M1.53901 20.0576H0V27.7729H1.53901V20.0576Z" fill="#3D2817"/>
                        </svg>
                        <span>Welcome</span>
                    </div>
                    <div className='landing-btn-container'>
                        <Link className="pixel-button" to="/readme">ReadMe.txt</Link>
                        <Link className="pixel-button" to="/chat">Enter Chat →</Link>
                    </div>
                    <div className="landing-subcopy">Here if you ever need it :)</div>
                </div>
            </div>
        </RetroWindow>
    );
}

export default Landing;