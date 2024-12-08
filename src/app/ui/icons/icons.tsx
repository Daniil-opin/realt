"use client";

import { ReactNode } from "react";

interface SVGCascadeProps {
  width: number;
  height: number;
  fill?: string;
  viewBox?: string;
  className?: string;
  children: ReactNode;
  style?: object;
  onClick?: () => void;
}

interface DefaultIconProps {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
}

interface ControlledIconProps extends DefaultIconProps {
  color?: string;
  onClick?: () => void;
}

export function SVGCascade({
  width = 26,
  height = 26,
  fill = "#000",
  viewBox = `0 0 ${width} ${height}`,
  className = "",
  children,
  onClick = () => {},
  style = {},
}: SVGCascadeProps) {
  return (
    <svg
      onClick={onClick}
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      className={`cursor-pointer ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function HeartIcon({
  width = 26,
  height = 26,
  fill,
  color = "black",
  className,
  onClick = () => {},
}: ControlledIconProps) {
  return (
    <SVGCascade
      width={width}
      onClick={onClick}
      viewBox="0 0 26 26"
      height={height}
      fill={fill}
      className={className}
    >
      <path
        d="M20.5834 15.6667C22.1975 14.085 23.8334 12.1892 23.8334 9.70833C23.8334 8.12809 23.2056 6.61256 22.0882 5.49516C20.9708 4.37775 19.4553 3.75 17.875 3.75C15.9684 3.75 14.625 4.29167 13 5.91667C11.375 4.29167 10.0317 3.75 8.12502 3.75C6.54477 3.75 5.02925 4.37775 3.91184 5.49516C2.79444 6.61256 2.16669 8.12809 2.16669 9.70833C2.16669 12.2 3.79169 14.0958 5.41669 15.6667L13 23.25L20.5834 15.6667Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVGCascade>
  );
}

export function KeyIconMain({
  width = 20,
  height = 20,
  fill,
  className,
}: DefaultIconProps) {
  return (
    <SVGCascade width={width} height={height} fill="none" className={className}>
      <path
        d="M16.4916 12.4416C14.775 14.1499 12.3166 14.6749 10.1583 13.9999L6.23331 17.9166C5.94998 18.2083 5.39165 18.3833 4.99165 18.3249L3.17498 18.0749C2.57498 17.9916 2.01665 17.4249 1.92498 16.8249L1.67498 15.0083C1.61665 14.6083 1.80831 14.0499 2.08331 13.7666L5.99998 9.84994C5.33331 7.68327 5.84998 5.22494 7.56665 3.5166C10.025 1.05827 14.0166 1.05827 16.4833 3.5166C18.95 5.97494 18.95 9.98327 16.4916 12.4416Z"
        stroke={fill}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.74164 14.5752L7.6583 16.4919"
        stroke={fill}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.0833 9.1665C12.7737 9.1665 13.3333 8.60686 13.3333 7.9165C13.3333 7.22615 12.7737 6.6665 12.0833 6.6665C11.393 6.6665 10.8333 7.22615 10.8333 7.9165C10.8333 8.60686 11.393 9.1665 12.0833 9.1665Z"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVGCascade>
  );
}

export function BuyIconMain({
  width = 20,
  height = 20,
  fill,
  className,
}: DefaultIconProps) {
  return (
    <SVGCascade width={width} height={height} fill="none" className={className}>
      <path
        d="M14.1667 17.0832H5.83335C3.33335 17.0832 1.66669 15.8332 1.66669 12.9165V7.08317C1.66669 4.1665 3.33335 2.9165 5.83335 2.9165H14.1667C16.6667 2.9165 18.3334 4.1665 18.3334 7.08317V12.9165C18.3334 15.8332 16.6667 17.0832 14.1667 17.0832Z"
        stroke={fill}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
        stroke={fill}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.58331 7.9165V12.0832"
        stroke={fill}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4167 7.9165V12.0832"
        stroke={fill}
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVGCascade>
  );
}

export function OpenEyeIcon({
  fill,
  className,
  onClick,
}: {
  fill: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <SVGCascade
      width={22}
      height={22}
      onClick={onClick}
      className={className}
      fill={fill}
    >
      <g id="iconEye">
        <path
          id="Vector"
          d="M11 5.95833C14.4742 5.95833 17.5725 7.91083 19.085 11C17.5725 14.0892 14.4834 16.0417 11 16.0417C7.51669 16.0417 4.42752 14.0892 2.91502 11C4.42752 7.91083 7.52585 5.95833 11 5.95833ZM11 4.125C6.41669 4.125 2.50252 6.97583 0.916687 11C2.50252 15.0242 6.41669 17.875 11 17.875C15.5834 17.875 19.4975 15.0242 21.0834 11C19.4975 6.97583 15.5834 4.125 11 4.125ZM11 8.70833C12.265 8.70833 13.2917 9.735 13.2917 11C13.2917 12.265 12.265 13.2917 11 13.2917C9.73502 13.2917 8.70835 12.265 8.70835 11C8.70835 9.735 9.73502 8.70833 11 8.70833ZM11 6.875C8.72669 6.875 6.87502 8.72667 6.87502 11C6.87502 13.2733 8.72669 15.125 11 15.125C13.2734 15.125 15.125 13.2733 15.125 11C15.125 8.72667 13.2734 6.875 11 6.875Z"
        />
      </g>
    </SVGCascade>
  );
}
export function CloseEyeIcon({
  fill,
  className,
  onClick,
}: {
  fill: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <SVGCascade
      onClick={onClick}
      width={22}
      height={21}
      className={className}
      fill={fill}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.2749 2.10001L2.0658 3.23533L17.6249 17.85L18.834 16.7143L3.2749 2.10001V2.10001Z"
      />
      <path d="M4.62033 5.63462L5.75838 6.70357C4.51258 7.69991 3.52054 8.94011 2.87948 10.0252L2.87753 10.0289C4.66288 12.8327 7.49572 15.4825 11.0711 15.0806C12.0362 14.972 12.9365 14.6622 13.7591 14.2188L14.9112 15.3006C13.3078 16.2673 11.4697 16.7792 9.47824 16.5261C5.88722 16.07 2.95092 13.3035 1.09998 10.0545C1.96903 8.41205 3.15784 6.84072 4.62033 5.63462V5.63462ZM7.20877 4.05046C8.21291 3.63021 9.29943 3.38305 10.4597 3.36545C10.5242 3.36508 11.289 3.39919 11.6357 3.45273C11.8531 3.48646 12.0698 3.52863 12.2834 3.58107C15.6897 4.4146 18.2133 7.11942 19.8 9.90601C19.1343 11.1686 18.2625 12.4007 17.2229 13.4565L16.1192 12.4198C16.8871 11.6424 17.5274 10.7769 18.0205 9.93755C18.0205 9.93755 17.5246 9.18873 17.1487 8.71862C16.907 8.41645 16.6529 8.12309 16.3858 7.84036C16.175 7.6174 15.3563 6.86015 15.1615 6.70247C13.8544 5.64673 12.3197 4.81834 10.4789 4.83227C9.76597 4.84291 9.08041 4.97492 8.42959 5.19715L7.20877 4.05046V4.05046Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.71829 8.54491L8.59684 9.36976L11.9785 12.546C11.5264 12.7844 11.0048 12.9201 10.45 12.9201C8.72243 12.9201 7.32007 11.6029 7.32007 9.98019C7.32007 9.4591 7.46491 8.96955 7.71829 8.54491ZM10.3922 7.04105C10.4114 7.04068 10.4309 7.04031 10.45 7.04031C12.1776 7.04031 13.5799 8.35789 13.5799 9.98019C13.5799 9.99853 13.58 10.0165 13.5796 10.0345L10.3922 7.04105Z"
      />
    </SVGCascade>
  );
}

export function Spinner({ width, height }: { width: string; height: string }) {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <div
        className={`my-auto ${width} ${height} animate-spin rounded-full border-2 border-blue border-t-transparent`}
      ></div>
    </div>
  );
}

export function UserIcon({
  width = 26,
  height = 26,
  fill,
  color = "black",
  className,
  onClick = () => {},
}: ControlledIconProps) {
  return (
    <SVGCascade
      width={width}
      onClick={onClick}
      viewBox="0 0 26 26"
      height={height}
      fill={fill}
      className={className}
    >
      <g id="iconUser">
        <path
          id="Vector"
          d="M20.5834 22.75V20.5833C20.5834 19.4341 20.1269 18.3319 19.3142 17.5192C18.5016 16.7065 17.3994 16.25 16.2501 16.25H9.75008C8.60081 16.25 7.49861 16.7065 6.68595 17.5192C5.87329 18.3319 5.41675 19.4341 5.41675 20.5833V22.75"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M13.0001 11.9167C15.3933 11.9167 17.3334 9.97657 17.3334 7.58333C17.3334 5.1901 15.3933 3.25 13.0001 3.25C10.6068 3.25 8.66675 5.1901 8.66675 7.58333C8.66675 9.97657 10.6068 11.9167 13.0001 11.9167Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </SVGCascade>
  );
}
