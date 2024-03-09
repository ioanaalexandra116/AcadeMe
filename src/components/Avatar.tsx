import { useState, useEffect } from "react";

interface AvatarProps {
  gender: string;
  backgroundColor: string;
  skinColor: string;
  eyeColor: string;
  mouthColor: string;
  hairColor: string;
  eyelidsColor: string;
  noseColor: string;
  bowColor?: string;
  dimensions: string;
}

function darkenColor(rgbColor: string, darkenAmount: number): string {
  // Extract the RGB components from the string
  const [rStr, gStr, bStr] = rgbColor
    .substring(4, rgbColor.length - 1)
    .split(",")
    .map((str) => str.trim());

  // Convert RGB components to numbers
  let r: number = parseInt(rStr, 10);
  let g: number = parseInt(gStr, 10);
  let b: number = parseInt(bStr, 10);

  // Decrease each RGB component by darkenAmount, ensuring they don't fall below 0
  r = Math.max(0, r - darkenAmount);
  g = Math.max(0, g - darkenAmount);
  b = Math.max(0, b - darkenAmount);

  // Assemble the darkened RGB color string
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

const Avatar = ({
  gender,
  backgroundColor,
  mouthColor,
  eyeColor,
  eyelidsColor,
  hairColor,
  skinColor,
  noseColor,
  dimensions,
  bowColor,
}: AvatarProps) => {
  const [bow, setBow] = useState(false);

  if (bowColor == "transparent" || bowColor == "noBow") {
    useEffect(() => {
      setBow(false);
    }, [bowColor]);
  } else {
    useEffect(() => {
      setBow(true);
    }, [bowColor]);
  }
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "300px", // Match the width of your SVG
    height: "300px", // Match the height of your SVG
  };

  const svgStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
  };
  const svgStyleBow: React.CSSProperties = {
    position: "absolute",
    top: 30,
    left: 42,
    transform: "rotate(10deg)",
  };

  const darkerBowColor = darkenColor(bowColor || "#d02547", 60);
  const topLipColor = darkenColor(mouthColor || "#d02547", 40);
  return gender === "man" ? (
    <div style={containerStyle}>
      <svg
        style={svgStyle}
        width={dimensions}
        height={dimensions}
        viewBox="-12.8 -12.8 89.60 89.60"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        className="iconify iconify--emojione"
        preserveAspectRatio="xMidYMid meet"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0">
          <rect
            x="-12.8"
            y="-12.8"
            width="89.60"
            height="89.60"
            rx="44.8"
            fill={backgroundColor}
            strokeWidth="0"
          />
        </g>

        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g id="SVGRepo_iconCarrier">
          <path
            d="M49.9 8.8c-9.8-13-37.6-3.3-39.7-4.2c0 0-.3 1.9.8 3.1c-1.4 1-3.1-.7-3.1-.7s-1.8 4.2.1 6.8c-3 3.9.6 24.2.6 24.2h45.9s5.5-15.9-.8-26.7c-1.3-2.5-2.7-1-3.8-2.5"
            fill={hairColor}
          />

          <path
            d="M55 29.6c-.2 1.1-.4 2.1-.7 2.7c-.5 1-1.6 1.6-1.6 1.6s.3-2.1.2-5.1C51.5 8.7 45.6 18.3 32 18.3c-13.6 0-19.5-9.6-20.8 10.6c-.1 2.9.2 5.1.2 5.1s-1.1-.6-1.6-1.6c-.3-.6-.5-1.6-.7-2.7c-1.8-.5-4-.1-4 5.2c0 3.3 1.2 5.9 5.1 6.2c1.7 13.2 4.7 15.3 14.6 20c2.5 1.2 4.2.9 7.2.9s4.7.3 7.3-.9c10-4.7 13-6.8 14.6-20c3.9-.3 5.1-3 5.1-6.2c0-5.3-2.3-5.7-4-5.3"
            fill={skinColor}
          />

          <path
            d="M41 48.9c0 3.4-4.5 5.1-9 5.1s-9-1.7-9-5.1c0 0 0-.9.9-.9h16.2c.9 0 .9.9.9.9"
            fill={mouthColor}
          />

          <path
            d="M20 28.6c-5 0-7 1.8-7 3.6s0 4.4 6.6 4.4c6.4 0 7.4-.8 7.4-3.5c0-1.8-2-4.5-7-4.5"
            fill="#f5f5f5"
          />

          <circle cx="20.5" cy="31.6" r="4.5" fill={eyeColor} />

          <path
            d="M22 31.6c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5s1.5.7 1.5 1.5"
            fill="#231f20"
          />

          <path d="M13 32.1c0-7 14-7 14 1c-2-6-12-6-14-1" fill={eyelidsColor} />

          <path
            d="M44 28.6c5 0 7 1.8 7 3.6s0 4.4-6.6 4.4c-6.4 0-7.4-.8-7.4-3.5c0-1.8 2-4.5 7-4.5"
            fill="#f5f5f5"
          />

          <circle cx="43.5" cy="31.6" r="4.5" fill={eyeColor} />

          <path
            d="M42 31.6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5"
            fill="#231f20"
          />

          <circle cx="21" cy="31.6" r="0.5" fill="#f5f5f5" />
          <circle cx="44" cy="31.6" r="0.5" fill="#f5f5f5" />

          <path d="M51 32.1c0-7-14-7-14 1c2-6 12-6 14-1" fill={eyelidsColor} />

          <path
            d="M32 45c-4.2 0-6.3-3-4.2-3h8.4c2.1 0 0 3-4.2 3"
            fill={noseColor}
          />
        </g>
      </svg>
      {bow && (
        <svg
          style={svgStyleBow}
          width={parseInt(dimensions) * 0.314 + ""}
          version="1.1"
          id="Layer_1"
          y-index="10"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
          xmlSpace="preserve"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />

          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              fill={darkerBowColor}
              d="M302.572,4.88c-36.082,15.241-57.429,89.227-69.714,158.597l115.659,115.667 c69.372-12.285,143.361-33.633,158.603-69.716C541.662,127.655,384.345-29.662,302.572,4.88z"
            />{" "}
            <path
              fill={bowColor}
              d="M302.572,4.88c-36.082,15.241-57.429,89.227-69.714,158.597l68.325,68.33 c69.371-12.285,143.358-33.633,158.6-69.715c14.235-33.7-4.117-80.23-36.337-120.874C382.802,8.998,336.272-9.355,302.572,4.88z"
            />{" "}
            <path
              fill={darkerBowColor}
              d="M163.475,232.858C94.105,245.143,20.122,266.491,4.88,302.572 c-34.543,81.773,122.775,239.09,204.547,204.547c36.082-15.242,57.429-89.227,69.715-158.598L163.475,232.858z"
            />{" "}
            <path
              fill={bowColor}
              d="M181.103,320.696c-12.905-13.709-41.285-47.61-44.011-82.736 C76.35,250.773,18.196,271.048,4.88,302.572c-22.232,52.63,35.011,136.548,100.438,180.473c20.542,6.527,40.208,7.403,56.773,0.406 c16.067-6.787,29.211-25.222,39.937-49.709c16.646-38.009,8.335-82.275-20.26-112.343 C181.537,321.155,181.315,320.921,181.103,320.696z"
            />{" "}
            <g>
              {" "}
              <path
                fill={darkerBowColor}
                d="M124.497,300.113c-3.919,0-7.505-2.615-8.568-6.581c-1.269-4.735,1.542-9.601,6.277-10.871 l52.477-14.061c4.734-1.267,9.601,1.542,10.871,6.277c1.269,4.735-1.542,9.601-6.277,10.871L126.8,299.809 C126.03,300.014,125.258,300.113,124.497,300.113z"
              />{" "}
              <path
                fill={darkerBowColor}
                d="M159.768,361.108c-2.271,0-4.543-0.866-6.276-2.6c-3.466-3.466-3.466-9.086,0-12.551l44.351-44.351 c3.466-3.466,9.086-3.466,12.551,0c3.466,3.466,3.466,9.086,0,12.551l-44.351,44.351 C164.31,360.241,162.039,361.108,159.768,361.108z"
              />{" "}
              <path
                fill={darkerBowColor}
                d="M276.951,186.709c-0.761,0-1.534-0.098-2.303-0.304c-4.735-1.269-7.544-6.136-6.277-10.871 l14.29-53.328c1.269-4.736,6.143-7.54,10.871-6.277c4.735,1.269,7.544,6.136,6.277,10.871l-14.29,53.328 C284.456,184.093,280.87,186.709,276.951,186.709z"
              />{" "}
              <path
                fill={darkerBowColor}
                d="M307.882,212.994c-2.271,0-4.543-0.866-6.276-2.6c-3.466-3.466-3.466-9.086,0-12.551l44.351-44.351 c3.466-3.466,9.086-3.466,12.551,0c3.466,3.466,3.466,9.086,0,12.551l-44.351,44.351 C312.425,212.127,310.153,212.994,307.882,212.994z"
              />{" "}
            </g>{" "}
            <path
              fill={bowColor}
              d="M348.463,281.752c-1.344,22.242-44.469,65.367-66.712,66.711 c-44.483,2.689-120.904-73.732-118.215-118.215c1.344-22.242,44.469-65.367,66.712-66.712 C274.731,160.849,351.151,237.269,348.463,281.752z"
            />{" "}
            <g>
              {" "}
              <path
                opacity="0.3"
                fill={bowColor}
                enableBackground="new"
                d="M230.248,163.537c-18.446,1.115-51.234,30.961-62.662,53.804 c16.208,43.696,76.584,97.891,114.165,95.619c18.446-1.115,51.234-30.961,62.662-53.804 C328.205,215.46,267.831,161.266,230.248,163.537z"
              />{" "}
              <ellipse
                transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 -112.7212 616.7843)"
                opacity="0.3"
                fill={bowColor}
                enableBackground="new"
                cx="71.38"
                cy="331.737"
                rx="46.858"
                ry="35.144"
              />{" "}
              <ellipse
                transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 536.0227 364.8118)"
                opacity="0.3"
                fill={bowColor}
                enableBackground="new"
                cx="343.566"
                cy="71.392"
                rx="46.858"
                ry="35.144"
              />{" "}
            </g>{" "}
          </g>
        </svg>
      )}
    </div>
  ) : (
    <div style={containerStyle}>
      <svg
        style={svgStyle}
        width={dimensions}
        height={dimensions}
        viewBox="-12.8 -12.8 89.60 89.60"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        className="iconify iconify--emojione"
        preserveAspectRatio="xMidYMid meet"
        fill="#000000"
      >
        <g
          id="SVGRepo_bgCarrier"
          strokeWidth="0"
          transform="translate(0,0), scale(1)"
        >
          <rect
            x="-12.8"
            y="-12.8"
            width="89.60"
            height="89.60"
            rx="44.8"
            fill={backgroundColor}
            strokeWidth="0"
          />
        </g>

        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g id="SVGRepo_iconCarrier">
          <path
            d="M32 2C13.9 2 4 13.4 4 28.5V62h56V28.5c0-22.4-15.2-22-15.2-22S43.7 2 32 2z"
            fill={hairColor}
          />

          <path
            d="M10.4 40.7S6 39.6 6 33.2c0-5.1 3.3-5.9 3.3-5.9C21.1 27.2 43 12 43 12s4.6 13.4 11.6 15.2c0 0 3.4.6 3.4 5.9c0 6.4-4.5 7.5-4.5 7.5C53.4 50.3 40.1 62 32 62S10.4 50.3 10.4 40.7z"
            fill={skinColor}
          />

          <path
            d="M32 47c-4.2 0-6.3-3-4.2-3h8.4c2.1 0 0 3-4.2 3"
            fill={noseColor}
          />

          <path
            d="M38.3 38.2c-1.5 0-1.3-1.8-1.3-1.8C39.2 24.9 52 31 52 31c1 2-2.3 6.9-3.2 7.2c-4.2 1-10.5 0-10.5 0"
            fill="#f5f5f5"
          />

          <path
            d="M48.5 33.5c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5s2-4.5 4.5-4.5s4.5 2 4.5 4.5"
            fill={eyeColor}
          />

          <circle cx="44" cy="33.5" r="1.5" fill="#2b2925" />

          <circle cx="44.8" cy="33.5" r="0.6" fill="#f5f5f5" />

          <path
            d="M37 36.3c2.2-13.7 13.5-4.6 18-6.5c-4.5 4.3-13.5-4.9-18 6.5"
            fill={eyelidsColor}
          />

          <path
            d="M25.7 38.2c1.5 0 1.3-1.8 1.3-1.8C24.8 24.9 12 31 12 31c-1 2 2.3 6.9 3.2 7.2c4.2 1 10.5 0 10.5 0"
            fill="#f5f5f5"
          />

          <path
            d="M15.5 33.5c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5s-2-4.5-4.5-4.5s-4.5 2-4.5 4.5"
            fill={eyeColor}
          />

          <path
            d="M27 36.3c-2.2-13.7-13.5-4.6-18-6.5c4.5 4.3 13.5-4.9 18 6.5"
            fill={eyelidsColor}
          />

          <path d="M32 52l-10-1.5c6 8.5 14 8.5 20 0L32 52z" fill={mouthColor} />

          <path
            d="M35.9 50.1c-2.9-1.1-3.9.7-3.9.7s-1-1.8-3.9-.7c-2.3.9-6.1.4-6.1.4c4 .9 4.5 2.5 10 2.5s6-1.7 10-2.5c0 0-3.8.5-6.1-.4"
            fill={topLipColor}
          />

          <circle cx="20" cy="33.5" r="1.5" fill="#2b2925" />

          <circle cx="20.8" cy="33.5" r="0.6" fill="#f5f5f5" />
        </g>
      </svg>
      {bow && (
        <svg
          style={svgStyleBow}
          width={parseInt(dimensions) * 0.312 + ""}
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
          xmlSpace="preserve"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />

          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              fill={darkerBowColor}
              d="M302.572,4.88c-36.082,15.241-57.429,89.227-69.714,158.597l115.659,115.667 c69.372-12.285,143.361-33.633,158.603-69.716C541.662,127.655,384.345-29.662,302.572,4.88z"
            />{" "}
            <path
              fill={bowColor}
              d="M302.572,4.88c-36.082,15.241-57.429,89.227-69.714,158.597l68.325,68.33 c69.371-12.285,143.358-33.633,158.6-69.715c14.235-33.7-4.117-80.23-36.337-120.874C382.802,8.998,336.272-9.355,302.572,4.88z"
            />{" "}
            <path
              fill={darkerBowColor}
              d="M163.475,232.858C94.105,245.143,20.122,266.491,4.88,302.572 c-34.543,81.773,122.775,239.09,204.547,204.547c36.082-15.242,57.429-89.227,69.715-158.598L163.475,232.858z"
            />{" "}
            <path
              fill={bowColor}
              d="M181.103,320.696c-12.905-13.709-41.285-47.61-44.011-82.736 C76.35,250.773,18.196,271.048,4.88,302.572c-22.232,52.63,35.011,136.548,100.438,180.473c20.542,6.527,40.208,7.403,56.773,0.406 c16.067-6.787,29.211-25.222,39.937-49.709c16.646-38.009,8.335-82.275-20.26-112.343 C181.537,321.155,181.315,320.921,181.103,320.696z"
            />{" "}
            <g>
              {" "}
              <path
                fill={darkerBowColor}
                d="M124.497,300.113c-3.919,0-7.505-2.615-8.568-6.581c-1.269-4.735,1.542-9.601,6.277-10.871 l52.477-14.061c4.734-1.267,9.601,1.542,10.871,6.277c1.269,4.735-1.542,9.601-6.277,10.871L126.8,299.809 C126.03,300.014,125.258,300.113,124.497,300.113z"
              />{" "}
              <path
                fill={darkerBowColor}
                d="M159.768,361.108c-2.271,0-4.543-0.866-6.276-2.6c-3.466-3.466-3.466-9.086,0-12.551l44.351-44.351 c3.466-3.466,9.086-3.466,12.551,0c3.466,3.466,3.466,9.086,0,12.551l-44.351,44.351 C164.31,360.241,162.039,361.108,159.768,361.108z"
              />{" "}
              <path
                fill={darkerBowColor}
                d="M276.951,186.709c-0.761,0-1.534-0.098-2.303-0.304c-4.735-1.269-7.544-6.136-6.277-10.871 l14.29-53.328c1.269-4.736,6.143-7.54,10.871-6.277c4.735,1.269,7.544,6.136,6.277,10.871l-14.29,53.328 C284.456,184.093,280.87,186.709,276.951,186.709z"
              />{" "}
              <path
                fill={darkerBowColor}
                d="M307.882,212.994c-2.271,0-4.543-0.866-6.276-2.6c-3.466-3.466-3.466-9.086,0-12.551l44.351-44.351 c3.466-3.466,9.086-3.466,12.551,0c3.466,3.466,3.466,9.086,0,12.551l-44.351,44.351 C312.425,212.127,310.153,212.994,307.882,212.994z"
              />{" "}
            </g>{" "}
            <path
              fill={bowColor}
              d="M348.463,281.752c-1.344,22.242-44.469,65.367-66.712,66.711 c-44.483,2.689-120.904-73.732-118.215-118.215c1.344-22.242,44.469-65.367,66.712-66.712 C274.731,160.849,351.151,237.269,348.463,281.752z"
            />{" "}
            <g>
              {" "}
              <path
                opacity="0.3"
                fill={bowColor}
                enableBackground="new"
                d="M230.248,163.537c-18.446,1.115-51.234,30.961-62.662,53.804 c16.208,43.696,76.584,97.891,114.165,95.619c18.446-1.115,51.234-30.961,62.662-53.804 C328.205,215.46,267.831,161.266,230.248,163.537z"
              />{" "}
              <ellipse
                transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 -112.7212 616.7843)"
                opacity="0.3"
                fill={bowColor}
                enableBackground="new"
                cx="71.38"
                cy="331.737"
                rx="46.858"
                ry="35.144"
              />{" "}
              <ellipse
                transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 536.0227 364.8118)"
                opacity="0.3"
                fill={bowColor}
                enableBackground="new"
                cx="343.566"
                cy="71.392"
                rx="46.858"
                ry="35.144"
              />{" "}
            </g>{" "}
          </g>
        </svg>
      )}
    </div>
  );
};

export default Avatar;
