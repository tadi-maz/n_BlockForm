import React, { useRef, SyntheticEvent } from "react"
import "./inputBlock.css"

type props = {
  id: string
  value: string
  disabled: boolean
  handleInput: (event: SyntheticEvent) => void
  handlePaste: (event: React.ClipboardEvent) => void
  handleKeyUp: (event: SyntheticEvent) => void
}

const inputBlock = ({
  id,
  value,
  disabled,
  handleInput,
  handlePaste,
  handleKeyUp
}: props) => {
  const inputBlock = useRef(null)

  return (
    <input
      className="input"
      id={id}
      disabled={disabled}
      inputMode="numeric"
      pattern="[0-9]*"
      type="text"
      autoCorrect="false"
      autoComplete="false"
      placeholder=""
      onChange={handleInput}
      ref={inputBlock}
      onPaste={handlePaste}
      value={value}
      onKeyUp={handleKeyUp}
    />
  )
}

export default inputBlock
