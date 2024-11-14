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
      <FiSearch size="28px" color="#237EFF" />
      <Input
        placeholder="검색"
        value={input}
        onChange={handleChangeInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {input && (
        <button type="button" onClick={handleClearInput}>
          <FaXmark size="20px" />
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
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 20px;

  &:hover {
    border-color: ${(props) => props.theme.colors.subBlue};
  }

  &:focus-within {
    border-color: ${(props) => props.theme.colors.darkBlue};
  }
`;

const Input = styled.input`
  flex: auto;
  width: 100%;
  border: none;

  &:focus {
    outline: none;
  }

  focus: none;
  ${(props) => props.theme.fontSize.s18h27};
`;
