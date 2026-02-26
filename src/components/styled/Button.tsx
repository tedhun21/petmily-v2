import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Spinner from '@/components/Spinner';
import { buttonStyles, type ButtonSize, type ButtonVariant } from '@/styles/helpers';

type StyleProps = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  borderRadius?: 'sm' | 'md' | 'lg' | 'circle';
  fullWidth?: boolean;
  $loading?: boolean;
};

type ButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
} & StyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, size, loading, disabled, ...rest }: ButtonProps) {
  return (
    <StyledButton disabled={disabled} $loading={loading} size={size} {...rest}>
      {loading ? (
        <>
          <Spinner size={size} />
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
}

const StyledButton = styled.button<StyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  border-radius: ${({ theme, borderRadius = 'md' }) => theme.radius[borderRadius]};
  ${({ theme, size = 'md' }) => buttonStyles.size(theme, size)};
  ${({ theme, variant = 'primary' }) => buttonStyles.variant(theme, variant)};
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
  ${({ $loading }) =>
    $loading &&
    css`
      pointer-events: none;
    `};

  ${({ disabled }) => (disabled ? `background-color: red` : null)};
`;
