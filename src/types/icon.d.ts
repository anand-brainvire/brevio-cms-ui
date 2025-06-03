export type EmailSvg = {
  className?: string;
};
export type FolderSvg = {
  className?: string;
};
export type CaretDownSvg = {
  className?: string;
};
export type CaretRightSvg = {
  className?: string;
};
export type CompressSvg = {
  className?: string;
  onClick: () => void;
};
export type ExpandSvg = {
  className?: string;
  onClick: () => void;
};
export type UserSvg = {
  className?: string
}
export type IconSvg = {
	className?: string;
	fontSize?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  marginleft?: string;
  marginbottom?: string;
};
