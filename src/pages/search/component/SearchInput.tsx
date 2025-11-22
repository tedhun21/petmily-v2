import { ChangeEvent, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import styled from '@emotion/styled';

interface SearchInputProps {
  input: string;
  setInput: (value: string) => void;
}

export default function SearchInput({ input, setInput }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const handleClearInput = () => {
    setInput('');
  };

  return (
    <InputSection $isFocused={isFocused}>
      <FiSearch size="28px" color="#279EFF" />
      <Input
        placeholder="검색"
        value={input}
        onChange={handleChangeInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {input && (
        <button type="button" onClick={handleClearInput}>
          <FaXmark size="20px" color="#279EFF" />
        </button>
      )}
    </InputSection>
  );
}

const InputSection = styled.section<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  border-radius: ${({ theme }) => theme.radius.lg};
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.hover};
    border-color: ${({ theme }) => theme.colors.line.box.highlight};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.line.box.highlight};
  }
`;

const Input = styled.input`
  flex: auto;
  width: 100%;
  background-color: inherit;
  border: none;
  color: inherit;

  &:focus {
    outline: none;
  }

  ${({ theme }) => theme.typeScale.lg};
`;
