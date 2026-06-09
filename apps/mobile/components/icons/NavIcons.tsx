import Svg, { Path } from 'react-native-svg';

interface NavIconProps {
  size?: number;
  color: string;
}

/**
 * Cohesive filled navbar icon set with true even-odd cutouts so the
 * punched-out shapes show whatever sits behind them (gold circle or pill).
 */

// پس‌انداز — wallet with a card-slot cutout
export function NavSavingsIcon({ size = 24, color }: NavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 8.6C3.5 6.9 4.9 5.5 6.6 5.5h10.8c1.7 0 3.1 1.4 3.1 3.1v6.8c0 1.7-1.4 3.1-3.1 3.1H6.6c-1.7 0-3.1-1.4-3.1-3.1V8.6Zm11.4 2.3a1.6 1.6 0 0 0 0 3.2h3.8v-3.2h-3.8Zm.3 1a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2Z"
      />
    </Svg>
  );
}

// علاقه‌مندی‌ها — solid heart
export function NavHeartIcon({ size = 24, color }: NavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 20.3c-.35 0-.7-.13-.97-.36C6.5 16.04 3.6 13.4 3.6 10.05 3.6 7.6 5.5 5.7 7.9 5.7c1.43 0 2.78.67 3.65 1.78L12 7.9l.45-.42A4.6 4.6 0 0 1 16.1 5.7c2.4 0 4.3 1.9 4.3 4.35 0 3.35-2.9 5.99-7.43 9.89-.27.23-.62.36-.97.36Z" />
    </Svg>
  );
}

// محاسبه — coin with a star cutout
export function NavGoldIcon({ size = 24, color }: NavIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3.6a8.4 8.4 0 1 0 0 16.8 8.4 8.4 0 0 0 0-16.8Zm0 4.3 1.27 2.58 2.84.41-2.06 2 .49 2.83L12 14.4l-2.54 1.33.49-2.83-2.06-2 2.84-.41L12 7.9Z"
      />
    </Svg>
  );
}
