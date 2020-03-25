import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import InputBlock from '.'
import React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

let container = null

describe('InputBlock', () => {
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    container = null
  })

  it('renders a text input', () => {
    // Given ... certain property values
    const id = '0'
    const value = '1'
    const handleInput = jest.fn()
    const handlePaste = jest.fn()
    const handleKeyUp = jest.fn()

    // when ... we render the component
    act(() => {
      render(
        <InputBlock
          id={id}
          value={value}
          disabled={false}
          handleInput={handleInput}
          handleKeyUp={handleKeyUp}
          handlePaste={handlePaste}
        />,
        container
      )
    })
    // Then ...  it renders a text input of type text inside with expected attributes set
    const input = document.querySelector('input')
    expect(input.id).toBe('0')
    expect(input.value).toBe('1')
  })

  it('should call the handleKeyUp function passed through props when onKeyUp is fired', () => {
    // Given ... certain property values
    const id = '0'
    const value = '1'
    const handleInput = jest.fn()
    const handlePaste = jest.fn()
    const handleKeyUp = jest.fn()

    // When ... we render the component
    act(() => {
      render(
        <InputBlock
          id={id}
          value={value}
          disabled={false}
          handleInput={handleInput}
          handlePaste={handlePaste}
          handleKeyUp={handleKeyUp}
        />,
        container
      )
    })
    const input = document.querySelector('input')

    // ... we trigger the onkeyup event of the component
    act(() => {
      input.focus()
      input.dispatchEvent(
        new KeyboardEvent('keyup', { key: '52', bubbles: true })
      )
    })

    // then ...  the handleInput function passed via props should be called
    expect(handleKeyUp).toHaveBeenCalled()
  })
})

describe('inputBlock onChange', () => {
  let wrapper = null

  beforeEach(() => {
    configure({ adapter: new Adapter() })
  })

  afterEach(() => {
    wrapper = null
  })

  it('should call the handleInput function passed through props when onChange is fired', () => {
    //Given ... certain property values
    const id = '0'
    const value = '1'
    const handleInput = jest.fn()
    const handlePaste = jest.fn()
    const handleKeyUp = jest.fn()

    //when ... we render the disabled NblockForm
    wrapper = mount(
      <InputBlock
        id={id}
        value={value}
        disabled={false}
        handleInput={handleInput}
        handlePaste={handlePaste}
        handleKeyUp={handleKeyUp}
      />
    )

    const input = wrapper.find('input')

    //... we enter a number into a block
    act(() => {
      input.simulate('change')
      return undefined
    })

    //then ... the value of each input block does not change
    expect(handleInput).toBeCalled()
  })
})
