import React from 'react';
import { Link } from 'react-router-dom';
import RetroWindow from '../components/RetroWindow';
import AppHeader from './AppHeader';

function Section({ children }) {
    return (
        <div className="readme-card">
            {children}
        </div>
    );
}

function Readme() {
    return (
        <RetroWindow title="readme-page">
            <div className="page-container">
                {/* <h1>hi</h1> */}
                <AppHeader>
                    <Link to="/">Home</Link> / Chat
                </AppHeader>
                <div className="readme-heading"><h3 style={{ margin: 0 }}>Why Pixels?</h3></div>

                <Section>
                    <div className="readme-block-title">
                        <i className='readme-block-icon'>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1138_123349)">
                                    <path d="M28.95 19.81H27.43V27.43H28.95V19.81Z" fill="#000001" />
                                    <path d="M27.43 27.43H25.91V28.96H27.43V27.43Z" fill="#000001" />
                                    <path d="M27.43 16.76H25.91V19.81H27.43V16.76Z" fill="#000001" />
                                    <path d="M25.91 3.05H24.38V16.76H25.91V3.05Z" fill="#000001" />
                                    <path d="M25.91 28.96H22.86V30.48H25.91V28.96Z" fill="#000001" />
                                    <path d="M24.38 1.53H22.86V3.05H24.38V1.53Z" fill="#000001" />
                                    <path d="M22.86 0H19.81V1.53H22.86V0Z" fill="#000001" />
                                    <path d="M22.86 30.48H9.14996V32H22.86V30.48Z" fill="#000001" />
                                    <path d="M21.34 18.29H19.81V19.81H21.34V18.29Z" fill="#000001" />
                                    <path d="M22.86 4.57H19.81V13.72H22.86V4.57Z" fill="#000001" />
                                    <path d="M19.81 22.86H18.29V24.38H19.81V22.86Z" fill="#000001" />
                                    <path d="M19.81 1.53H18.29V3.05H19.81V1.53Z" fill="#000001" />
                                    <path d="M18.29 3.05H16.76V15.24H18.29V3.05Z" fill="#000001" />
                                    <path d="M18.29 24.38H15.24V25.91H18.29V24.38Z" fill="#000001" />
                                    <path d="M15.24 22.86H16.76V21.34H18.29V19.81H13.72V21.34H15.24V22.86Z" fill="#000001" />
                                    <path d="M16.76 15.24H15.24V16.76H16.76V15.24Z" fill="#000001" />
                                    <path d="M15.24 3.05H13.72V15.24H15.24V3.05Z" fill="#000001" />
                                    <path d="M13.72 1.53H12.19V3.05H13.72V1.53Z" fill="#000001" />
                                    <path d="M12.19 18.29H10.67V19.81H12.19V18.29Z" fill="#000001" />
                                    <path d="M12.19 0H9.14996V1.53H12.19V0Z" fill="#000001" />
                                    <path d="M12.19 4.57H9.14996V13.72H12.19V4.57Z" fill="#000001" />
                                    <path d="M9.14998 28.96H6.09998V30.48H9.14998V28.96Z" fill="#000001" />
                                    <path d="M9.14999 1.53H7.62V3.05H9.14999V1.53Z" fill="#000001" />
                                    <path d="M7.61998 3.05H6.09998V16.76H7.61998V3.05Z" fill="#000001" />
                                    <path d="M6.10001 27.43H4.57001V28.96H6.10001V27.43Z" fill="#000001" />
                                    <path d="M6.10001 16.76H4.57001V19.81H6.10001V16.76Z" fill="#000001" />
                                    <path d="M4.56999 19.81H3.04999V27.43H4.56999V19.81Z" fill="#000001" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1138_123349">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </i>
                        What is this?
                    </div>
                    <div className="readme-block-content">
                        Hey. First off, I'm sorry this is a lot. You're a good friend, Veer. You were there for me when I thought no one would be, I'll always be grateful for that. I hope you're okay. 
                        <br/><br/>
                        Quick story: One night, A little while back, I was super sad. The kind of sad where you wonder if it'll make a difference if you disappear. Right then, Bharath sent a brain-rot reel. I laughed. It helped :)
                        <br/><br/>
                        So this app is my selfish way of trying to be there for you in the tiniest capacity. Just to make sure you know you're always missed, without spamming your chats or imposing xD
                        <br/><br/>
                        <strong>There's a high chance this is not something you need or want. In which case, please feel free to not use it :) You have no obligation to like this, much less use it. For real. I just want you to have the option if you feel like it.</strong>
                        <br/><br/>
                        Best case scenario would be you being so happy/busy that you don't ever have time for this OR you accidently stumble on it and it makes you smile :3
                        <br/><br/>
                        PS* Incase you're upset with me, I'm sorry.
                    </div>
                </Section>

                <Section>
                    <div className="readme-block-title">
                        <i className='readme-block-icon'>
                            <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M63.4288 12.696H60.2656V15.8592H57.0815V19.0432H60.2656V22.2065H63.4288V19.0432H66.592V15.8592H63.4288V12.696Z" fill="#000001"/>
                            <path d="M63.4305 38.0621H60.2673V34.8989H53.9201V22.2044H31.7153V34.8989H9.51042V38.0621H6.34721V41.2253H3.18401V44.4093H0V47.5725H9.51042V66.5933H57.0833V47.5725H66.5937V41.2253H63.4305V38.0621ZM34.8785 25.3676H50.7361V34.8989H34.8785V25.3676ZM38.0625 63.4301H12.6944V47.5725H34.8785V44.4093H38.0625V63.4301ZM53.9201 63.4301H41.2257V38.0621H53.9201V63.4301Z" fill="#000001"/>
                            <path d="M44.4084 6.34526H41.2244V9.52927H44.4084V6.34526Z" fill="#000001"/>
                            <path d="M34.8789 0V15.8576H50.7365V12.6944H47.5733V9.53123H44.4101V12.6944H38.0629V6.34721H41.2261V3.18401H38.0629V0H34.8789Z" fill="#000001"/>
                            <path d="M28.5512 15.861H25.3672V25.3714H28.5512V15.861Z" fill="#000001"/>
                            <path d="M25.3676 25.3692H22.2044V28.5532H25.3676V25.3692Z" fill="#000001"/>
                            <path d="M25.3676 12.696H22.2044V15.8592H25.3676V12.696Z" fill="#000001"/>
                            <path d="M22.203 28.5497H12.6926V31.7129H22.203V28.5497Z" fill="#000001"/>
                            <path d="M22.203 9.53171H12.6926V12.6949H22.203V9.53171Z" fill="#000001"/>
                            <path d="M12.694 25.3692H9.51001V28.5532H12.694V25.3692Z" fill="#000001"/>
                            <path d="M12.694 12.696H9.51001V15.8592H12.694V12.696Z" fill="#000001"/>
                            <path d="M9.51043 15.861H6.34723V25.3714H9.51043V15.861Z" fill="#000001"/>
                            <path d="M6.34765 3.18645H3.18445V6.34966H6.34765V3.18645Z" fill="#000001"/>
                            </svg>
                        </i>
                        What is Pixels?
                    </div>
                    <div className="readme-block-content">
                        Pixels is a mini app that stores messages I'd like to send you. Just stuff that I think you'd like, possibly even make you smile.
                        <br/><br/>
                        The messages are divided into categories, you choose when you want to see the next message.
                    </div>
                </Section>

                <Section>
                    <div className="readme-block-title">
                        <i className='readme-block-icon'>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1128_21533)">
                                    <path d="M32 12.19H30.48V19.81H32V12.19Z" />
                                    <path d="M30.48 19.81H28.95V22.86H30.48V19.81Z" />
                                    <path d="M30.48 9.14001H28.95V12.19H30.48V9.14001Z" />
                                    <path d="M28.95 22.86H27.43V25.9H28.95V22.86Z" />
                                    <path d="M28.95 6.09H27.43V9.14H28.95V6.09Z" />
                                    <path d="M27.43 25.9H25.9V27.43H27.43V25.9Z" />
                                    <path d="M27.43 4.57001H25.9V6.09001H27.43V4.57001Z" />
                                    <path d="M25.9 27.43H22.86V28.95H25.9V27.43Z" />
                                    <path d="M25.9 3.04999H22.86V4.56999H25.9V3.04999Z" />
                                    <path d="M22.86 28.95H19.81V30.48H22.86V28.95Z" />
                                    <path d="M21.33 6.09001H19.81V4.57001H12.19V6.09001H10.67V7.62001H9.14V12.19H12.19V9.14001H13.71V7.62001H16.76V9.14001H18.29V12.19H16.76V13.71H15.24V15.24H13.71V18.29H18.29V16.76H19.81V15.24H21.33V13.71H22.86V7.62001H21.33V6.09001Z" />
                                    <path d="M22.86 1.51999H19.81V3.04999H22.86V1.51999Z" />
                                    <path d="M19.81 30.48H12.19V32H19.81V30.48Z" />
                                    <path d="M18.29 19.81H13.71V21.33H12.19V25.9H13.71V27.43H18.29V25.9H19.81V21.33H18.29V19.81Z" />
                                    <path d="M19.81 0H12.19V1.52H19.81V0Z" />
                                    <path d="M12.19 28.95H9.14V30.48H12.19V28.95Z" />
                                    <path d="M12.19 1.51999H9.14V3.04999H12.19V1.51999Z" />
                                    <path d="M9.14 27.43H6.09V28.95H9.14V27.43Z" />
                                    <path d="M9.14 3.04999H6.09V4.56999H9.14V3.04999Z" />
                                    <path d="M6.09 25.9H4.57V27.43H6.09V25.9Z" />
                                    <path d="M6.09 4.57001H4.57V6.09001H6.09V4.57001Z" />
                                    <path d="M4.57 22.86H3.05V25.9H4.57V22.86Z" />
                                    <path d="M4.57 6.09H3.05V9.14H4.57V6.09Z" />
                                    <path d="M3.05 19.81H1.52V22.86H3.05V19.81Z" />
                                    <path d="M3.05 9.14001H1.52V12.19H3.05V9.14001Z" />
                                    <path d="M1.52 12.19H0V19.81H1.52V12.19Z" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1128_21533">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </i>
                        How to use Pixels
                    </div>
                    <div className="readme-block-content">
                        <ol style={{ paddingInlineStart: "12px" }}>
                            <li>Browse content organized by categories (Reels, Songs, Voice Notes, etc.) and stored chronologically. New items are automatically added to the end of the list. </li>
                            <li>Click "Next" to see the next item in that category.</li>
                            <li>Use the shufflele "🎲" button to choose a random category.</li>
                            <li>Leave comments with the 💬 button. I can see comments you add.</li>
                            <li>It remembers where you left off, so come back anytime :)</li>
                        </ol>
                    </div>
                </Section>

                <Section>
                    <div className="readme-block-title">
                        <i className='readme-block-icon'>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1128_24123)">
                                    <path d="M32 4.57001H30.48V28.95H32V4.57001Z" fill="#000001" />
                                    <path d="M30.48 28.95H28.95V30.48H30.48V28.95Z" fill="#000001" />
                                    <path d="M30.48 3.04999H28.95V4.56999H30.48V3.04999Z" fill="#000001" />
                                    <path d="M28.95 30.48H3.05V32H28.95V30.48Z" fill="#000001" />
                                    <path d="M25.91 24.38H6.10001V25.91H25.91V24.38Z" fill="#000001" />
                                    <path d="M25.91 18.29H6.10001V19.81H25.91V18.29Z" fill="#000001" />
                                    <path d="M25.91 12.19H18.29V13.71H25.91V12.19Z" fill="#000001" />
                                    <path d="M25.91 7.62H18.29V9.14H25.91V7.62Z" fill="#000001" />
                                    <path d="M7.62 3.05V13.71H9.14V12.19H10.67V10.67H12.19V12.19H13.71V13.71H15.24V3.05H28.95V1.52H13.71V0H4.57V1.52H1.52V3.05H7.62ZM10.67 1.52H12.19V3.05H13.71V6.1H12.19V3.05H10.67V1.52Z" fill="#000001" />
                                    <path d="M3.05 28.95H1.52V30.48H3.05V28.95Z" fill="#000001" />
                                    <path d="M1.52 3.04999H0V28.95H1.52V3.04999Z" fill="#000001" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1128_24123">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </i>
                        Categories
                    </div>
                    <div className="readme-block-content">
                        <ul style={{ paddingInlineStart: "12px" }}>
                            <li>🎬 Reels: Stuff that I found funny or cute and think you might like.</li>
                            <li>🎧 Music: Songs that reminds me of you.</li>
                            <li>📖 Stories: When I'm down, listening to my Dad tell religious/puranic stories he knows always makes me feel better. It  might interest you.</li>
                            <li>🗒️ Notes: Affirmations and 'Thank You'.s</li>
                            <li>⭐ Misc: Everything else I couldn't categories xD</li>
                        </ul>
                    </div>
                </Section>

                <Section>
                    <div className="readme-block-title">
                        <i className='readme-block-icon'>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_1128_22331)">
                                    <path d="M27.425 13.71H25.905V28.95H27.425V13.71Z" />
                                    <path d="M25.905 28.95H24.375V30.48H25.905V28.95Z" />
                                    <path d="M24.375 30.48H7.61499V32H24.375V30.48Z" />
                                    <path d="M22.855 1.52H21.335V3.05H22.855V1.52Z" />
                                    <path d="M18.285 19.81H16.765V18.29H18.285V16.76H13.715V18.29H12.185V21.33H13.715V22.86H15.235V27.43H16.765V22.86H18.285V21.33H19.805V18.29H18.285V19.81Z" />
                                    <path d="M21.335 0H10.665V1.52H21.335V0Z" />
                                    <path d="M10.665 1.52H9.145V3.05H10.665V1.52Z" />
                                    <path d="M25.905 13.71V12.19H24.375V3.05H22.855V12.19H9.145V3.05H7.615V12.19H6.095V13.71H25.905Z" />
                                    <path d="M7.615 28.95H6.095V30.48H7.615V28.95Z" />
                                    <path d="M6.095 13.71H4.575V28.95H6.095V13.71Z" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1128_22331">
                                        <rect width="32" height="32" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </i>
                        Privacy
                    </div>
                    <div className="readme-block-content">
                        This is an SPA and hence runs completely on your device. It uses local and session storage cookies to remember progress - these are contained within your device.
                        <br/><br/>
                        I won't know if you ever use the app. Won't ever ask you about it too.
                        <br /><br />
                        I'd only know if you add a comment from within the chat screen.
                    </div>
                </Section>

                <div className="return-home-btn">
                    <Link className="pixel-button" to="/">Return →</Link>
                </div>
            </div>
        </RetroWindow>
    );
}

export default Readme;