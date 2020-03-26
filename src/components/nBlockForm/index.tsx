import React, {
  useState,
  useRef,
  useEffect,
  SyntheticEvent,
  BaseSyntheticEvent
} from "react"
import InputBlock from "../inputBlock"
import "./nBlockForm.css"

type props = {
  onSubmit: (otp: string) => void
  noOfBlocks: number
  disabled: boolean
}

const nBlockForm = ({ onSubmit, noOfBlocks, disabled }: props) => {
  const inputBlockContainer = useRef(null)
  const [otp, setOTP] = useState([])

  useEffect(() => {
    if (!disabled && inputBlockContainer) {
      return inputBlockContainer.current.children[0].focus()
    }
  }, [disabled])

  useEffect(() => {
    shouldSubmit()
  })

  const shouldSubmit = () => {
    if (otp.some(value => value === undefined) || otp.length !== 6) {
      return
    }
    return onSubmit(otp.join(""))
  }

  const handleInput = (event: BaseSyntheticEvent) => {
    const nativeEvent = event.nativeEvent as InputEvent
    const currentIndex = parseInt(event.currentTarget.getAttribute("id"), 10)
    const value =
      event.currentTarget.value[event.currentTarget.value.length - 1]
    // Check if it's a backspace
    if (nativeEvent.inputType === "deleteContentBackward") {
      updateOTP(undefined, currentIndex)

      if (currentIndex > 0) {
        const prevElement =
          inputBlockContainer.current.children[`${currentIndex - 1}`]
        prevElement.focus()
        prevElement.value = otp[currentIndex - 1]
      }
      return
    }

    // Check if input is numeric
    if (/[0-9]/.test(value)) {
      updateOTP(value, currentIndex)
      // if there's a next element, focus on next element
      if (currentIndex < noOfBlocks - 1) {
        return inputBlockContainer.current.children[
          `${currentIndex + 1}`
        ].focus()
      }
    }
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    const paste = event.clipboardData.getData("Text").trim()
    if (/[0-9]/.test(paste) && paste.length <= noOfBlocks) {
      const otp = []
      paste.split("").map((pasteItem, index) => (otp[index] = pasteItem))
      setOTP(otp)
    }
  }

  const handleBackspace = (event: SyntheticEvent) => {
    const input = event.currentTarget
    const nativeEvent = event.nativeEvent as KeyboardEvent
    const currentIndex = parseInt(input.getAttribute("id"))

    if (
      nativeEvent.key !== "Backspace" ||
      currentIndex === 0 ||
      otp[currentIndex]
    ) {
      return
    }

    const prevElement =
      inputBlockContainer.current.children[`${currentIndex - 1}`]
    prevElement.focus()
    updateOTP(undefined, currentIndex - 1)
  }

  const updateOTP = (newValue: string, currentIndex: number) => {
    if (currentIndex < 0 || currentIndex > noOfBlocks - 1) {
      return
    }
    setOTP(Object.assign(otp.slice(), { [currentIndex]: newValue }))
  }

  const createInputBlocks = (noOfBlocks: number) => {
    let blocks = []

    for (let i = 0; i < noOfBlocks; i++) {
      blocks.push(
        <InputBlock
          key={i.toString()}
          id={i.toString()}
          disabled={disabled}
          value={otp[i] || ""}
          handleInput={handleInput}
          handlePaste={handlePaste}
          handleKeyUp={handleBackspace}
        />
      )
    }
    return blocks
  }

  return (
    <form>
      <div ref={inputBlockContainer} id="otp-code" className="otpcontainer">
        {createInputBlocks(noOfBlocks)}
      </div>
    </form>
  )
}

export default nBlockForm
