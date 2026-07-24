interface Props {
  size?: number;
}

export function Logo({ size = 18 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.5 32 L29 32"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M31 32 L56 17 L56 25.5 Z" fill="#38bdf8" />
      <path d="M31 32 L58 28.5 L58 35.5 Z" fill="#8b5cf6" />
      <path d="M31 32 L56 38.5 L56 47 Z" fill="#ec4899" />
    </svg>
  );
}
