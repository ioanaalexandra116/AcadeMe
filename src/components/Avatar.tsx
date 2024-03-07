interface AvatarProps {
    backgroundColor: string;
    skinColor: string;
    eyeColor: string;
    mouthColor: string;
    hairColor: string;
    eyelidsColor: string;
    noseColor: string;
}

const Avatar = ({ backgroundColor, skinColor, eyeColor, mouthColor, hairColor, eyelidsColor, noseColor }: AvatarProps) => {
    return (
        <svg width="256px" height="256px" viewBox="-12.8 -12.8 89.60 89.60" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="iconify iconify--emojione" preserveAspectRatio="xMidYMid meet" fill="#000000">

<g id="SVGRepo_bgCarrier" stroke-width="0">

<rect x="-12.8" y="-12.8" width="89.60" height="89.60" rx="44.8" fill={backgroundColor} stroke-width="0"/>

</g>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier">

<path d="M49.9 8.8c-9.8-13-37.6-3.3-39.7-4.2c0 0-.3 1.9.8 3.1c-1.4 1-3.1-.7-3.1-.7s-1.8 4.2.1 6.8c-3 3.9.6 24.2.6 24.2h45.9s5.5-15.9-.8-26.7c-1.3-2.5-2.7-1-3.8-2.5" fill={hairColor} />

<path d="M55 29.6c-.2 1.1-.4 2.1-.7 2.7c-.5 1-1.6 1.6-1.6 1.6s.3-2.1.2-5.1C51.5 8.7 45.6 18.3 32 18.3c-13.6 0-19.5-9.6-20.8 10.6c-.1 2.9.2 5.1.2 5.1s-1.1-.6-1.6-1.6c-.3-.6-.5-1.6-.7-2.7c-1.8-.5-4-.1-4 5.2c0 3.3 1.2 5.9 5.1 6.2c1.7 13.2 4.7 15.3 14.6 20c2.5 1.2 4.2.9 7.2.9s4.7.3 7.3-.9c10-4.7 13-6.8 14.6-20c3.9-.3 5.1-3 5.1-6.2c0-5.3-2.3-5.7-4-5.3" fill={skinColor}/>

<path d="M41 48.9c0 3.4-4.5 5.1-9 5.1s-9-1.7-9-5.1c0 0 0-.9.9-.9h16.2c.9 0 .9.9.9.9" fill={mouthColor}/>

<path d="M20 28.6c-5 0-7 1.8-7 3.6s0 4.4 6.6 4.4c6.4 0 7.4-.8 7.4-3.5c0-1.8-2-4.5-7-4.5" fill="#f5f5f5"/>

<circle cx="20.5" cy="31.6" r="4.5" fill={eyeColor}/>

<path d="M22 31.6c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5s1.5.7 1.5 1.5" fill="#231f20"/>

<path d="M13 32.1c0-7 14-7 14 1c-2-6-12-6-14-1" fill={eyelidsColor}/>

<path d="M44 28.6c5 0 7 1.8 7 3.6s0 4.4-6.6 4.4c-6.4 0-7.4-.8-7.4-3.5c0-1.8 2-4.5 7-4.5" fill="#f5f5f5"/>

<circle cx="43.5" cy="31.6" r="4.5" fill={eyeColor}/>

<path d="M42 31.6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5" fill="#231f20"/>

<path d="M51 32.1c0-7-14-7-14 1c2-6 12-6 14-1" fill={eyelidsColor}/>

<path d="M32 45c-4.2 0-6.3-3-4.2-3h8.4c2.1 0 0 3-4.2 3" fill={noseColor}/>

</g>

</svg>
    );
}

export default Avatar;