import { ChangeEvent, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import styled from 'styled-components';

export default function SearchInput({ input, setInput }: any) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const handleClearInput = () => {
    setInput('');
  };

  return (
    <InputSection isFocused={isFocused}>
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

const InputSection = styled.section<{ isFocused: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 2px solid ${({ theme }) => theme.line.box.blue};
  border-radius: 20px;
  background-color: ${({ theme }) => theme.background.box.default.primary};

  &:hover {
    border-color: ${({ theme }) => theme.line.box.blue};
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.line.box.blue};
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

  ${({ theme }) => theme.fontSize.s18h27};
`;
