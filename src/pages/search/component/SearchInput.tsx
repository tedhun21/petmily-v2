import { ChangeEvent, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import styled from 'styled-components';

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
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.box.default.primary};
  border: 2px solid ${({ theme }) => theme.colors.line.box.highlight};
  border-radius: 20px;
  gap: 8px;

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
  border: none;
  background-color: inherit;
  color: inherit;

  &:focus {
    outline: none;
  }

  ${({ theme }) => theme.typeScale.lg};
`;
