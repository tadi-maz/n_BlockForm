import React from 'react'
import NBlockForm from '.'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

let container = null

describe('N-block form', () => {
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    container = null
  })

  it('renders the correct number of input blocks', () => {
    //Given ... certain property values
    const noOfBlocks = 6
    const onSubmit = jest.fn()

    //when ... we render the component
    act(() => {
      render(
        <NBlockForm
          onSubmit={onSubmit}
          noOfBlocks={noOfBlocks}
          disabled={false}
        />,
        container
      )
    })

    //then ... the correct number of input blocks is displayed
    const inputs = document.querySelectorAll('input')
    expect(inputs.length).toBe(noOfBlocks)
  })

  it('sets the state of "otp" to the OTP entered', () => {
    //Given ... certain property values
    const noOfBlocks = 6
    const onSubmit = jest.fn()

    //when ... we render the component
    act(() => {
      render(
        <NBlockForm
          onSubmit={onSubmit}
          noOfBlocks={noOfBlocks}
          disabled={false}
        />,
        container
      )
    })

    let inputs = document.querySelectorAll('input')

    //... we enter a valid 6-digit OTP
    inputs.forEach((input, index) => {
      act(() => {
        input.focus()
        input.dispatchEvent(
          new KeyboardEvent('keydown', { key: index.toString(), bubbles: true })
        )
      })
    })

    //then ... the 6 digit input must be stored in state
    inputs.forEach((input, index) => {
      expect(input.value).toBe(index.toString())
    })
  })

  it('submits the form with given values if all blocks are filled', () => {
    //Given ... certain property values
    const noOfBlocks = 6
    const onSubmit = jest.fn()

    //when ... we render the component
    act(() => {
      render(
        <NBlockForm
          onSubmit={onSubmit}
          noOfBlocks={noOfBlocks}
          disabled={false}
        />,
        container
      )
    })
    let inputs = document.querySelectorAll('input')

    //... we enter a 6 digit otp
    inputs.forEach((input, index) => {
      act(() => {
        input.focus()
        input.dispatchEvent(
          new KeyboardEvent('keydown', { key: index.toString(), bubbles: true })
        )
      })
    })
    //then ... the form is submitted
    expect(onSubmit).toBeCalledTimes(1)
  })

  it('disallows any input which is not a number', () => {
    //Given ... certain property values
    const noOfBlocks = 6
    const onSubmit = jest.fn()

    //when ... we render the component
    act(() => {
      render(
        <NBlockForm
          onSubmit={onSubmit}
          noOfBlocks={noOfBlocks}
          disabled={false}
        />,
        container
      )
    })

    const inputs = document.querySelectorAll('input')

    //... we enter invalid values on every InputBlock (such letters or special characters)
    inputs.forEach((input, index) => {
      act(() => {
        inputs[index].focus()
        inputs[index].dispatchEvent(
          new KeyboardEvent('keydown', { key: 'e', bubbles: true })
        )
      })
    })

    //then ... the value of each block is set to an empty space
    inputs.forEach((input, index) => expect(input.value).toBe(''))
  })
})

describe('N-block Disabled', () => {
  let wrapper = null

  beforeEach(() => {
    configure({ adapter: new Adapter() })
  })

  afterEach(() => {
    wrapper = null
  })

  it.only('disallows any input if NBlockForm is disabled', () => {
    //Given ... certain property values
    const noOfBlocks = 6
    const onSubmit = jest.fn()

    //when ... we render the disabled NblockForm
    wrapper = mount(
      <NBlockForm onSubmit={onSubmit} noOfBlocks={noOfBlocks} disabled={true} />
    )

    const inputs = wrapper.find('input')

    //... we enter a sequence of numbers (OTP)
    inputs.forEach((input, index) => {
      act(() => {
        input.simulate('keypress', { key: index.toString() })
        return undefined
      })
    })

    //then ... the value of each input block does not change
    inputs.forEach(input => expect(input.prop('value')).toBe(''))
  })
})
