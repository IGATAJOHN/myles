export default function BrandMark({ className = "brand-mark" }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 120 120" role="img">
        <path
          d="M17 14v40h18V35l19 19 8-7-28-28Zm86 0L74 43l8 7 19-19v23h18V14Zm-86 92 20-20v20h10V72H17Zm86 0V72H73v34h10V86l20 20Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 24 64 48 60 60 56 48Zm0 72-4-24 4-12 4 12ZM24 60l24-4 12 4-12 4Zm72 0-24 4-12-4 12-4Z"
          fill="currentColor"
        />
        <path
          d="M60 42 64 56 78 60 64 64 60 78 56 64 42 60 56 56Z"
          fill="currentColor"
        />
        <path
          d="M40 34 48 48M80 34 72 48M34 40 48 48M86 40 72 48M40 86 48 72M80 86 72 72M34 80 48 72M86 80 72 72"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
