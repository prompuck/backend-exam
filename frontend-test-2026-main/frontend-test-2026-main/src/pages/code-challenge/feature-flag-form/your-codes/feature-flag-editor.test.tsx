import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FeatureFlagEditor } from './feature-flag-editor'
import type { SerializedFeatureFlag } from './types/feature-flag'

vi.mock('@monaco-editor/react', () => ({
  Editor: ({ value }: { value: string }) => (
    <pre data-testid="json-preview">{value}</pre>
  ),
}))

function previewJson(): SerializedFeatureFlag {
  return JSON.parse(screen.getByTestId('json-preview').textContent ?? '{}')
}

function valueOf(label: string, index = 0): string {
  const elements = screen.getAllByLabelText(label)
  return (elements[index] as HTMLInputElement).value
}

function typeInto(element: HTMLElement, value: string) {
  fireEvent.change(element, { target: { value } })
}

describe('FeatureFlagEditor', () => {
  it('renders the initial example flag and derives the JSON preview from it', () => {
    render(<FeatureFlagEditor />)

    expect(valueOf('Flag key')).toBe('new-checkout')
    expect(previewJson()).toEqual({
      key: 'new-checkout',
      description: 'Enable new checkout flow',
      enabled: true,
      variations: { on: true, off: false },
      targeting: [],
      defaultVariation: 'off',
    })
  })

  it('updates the JSON preview in real time while editing', () => {
    render(<FeatureFlagEditor />)

    typeInto(screen.getByLabelText('Flag key'), 'checkout-v2')
    expect(previewJson().key).toBe('checkout-v2')

    fireEvent.click(screen.getByRole('switch', { name: 'Flag enabled' }))
    expect(previewJson().enabled).toBe(false)

    typeInto(screen.getByLabelText('Description'), '')
    expect('description' in previewJson()).toBe(false)
  })

  it('colours the status pill by state and marks only the required fields', () => {
    render(<FeatureFlagEditor />)

    expect(screen.getByText('Enabled').className).toContain('emerald')

    fireEvent.click(screen.getByRole('switch', { name: 'Flag enabled' }))
    expect(screen.getByText('Disabled').className).toContain('zinc')

    expect(
      screen.getByLabelText('Flag key').getAttribute('aria-required'),
    ).toBe('true')
    expect(
      screen.getByLabelText('Description').getAttribute('aria-required'),
    ).toBeNull()
  })

  it('adds, edits and removes variations dynamically', () => {
    render(<FeatureFlagEditor />)

    fireEvent.click(screen.getByRole('button', { name: /add variation/i }))
    typeInto(screen.getByLabelText('Key #3'), 'control')
    fireEvent.change(screen.getAllByLabelText('Type')[2], {
      target: { value: 'string' },
    })
    typeInto(screen.getAllByLabelText('Value')[2], 'legacy')

    expect(screen.getAllByLabelText('Value')).toHaveLength(3)
    expect(previewJson().variations).toEqual({
      on: true,
      off: false,
      control: 'legacy',
    })

    fireEvent.click(screen.getByRole('button', { name: 'Remove variation 3' }))
    expect(previewJson().variations).toEqual({ on: true, off: false })
  })

  it('reports duplicate and empty variation keys', async () => {
    render(<FeatureFlagEditor />)

    typeInto(screen.getByLabelText('Key #2'), 'on')
    expect(
      await screen.findByText(
        /Duplicate key "on" — variation keys must be unique/,
      ),
    ).toBeTruthy()

    typeInto(screen.getByLabelText('Key #2'), '')
    expect(await screen.findByText('Variation key is required')).toBeTruthy()
  })

  it('requires at least one variation', async () => {
    render(<FeatureFlagEditor />)

    fireEvent.click(screen.getByRole('button', { name: 'Remove variation 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove variation 1' }))

    expect(
      await screen.findByText('A flag needs at least one variation'),
    ).toBeTruthy()
    expect(previewJson().variations).toEqual({})
  })

  it('adds targeting rules with conditions and serializes them', async () => {
    render(<FeatureFlagEditor />)

    fireEvent.click(screen.getByRole('button', { name: /add rule/i }))
    const rule = within(screen.getByRole('article'))
    const attribute = rule.getByLabelText('Attribute') as HTMLSelectElement
    expect(attribute.tagName).toBe('SELECT')
    expect(
      Array.from(attribute.options).map((option) => option.value),
    ).toContain('country')

    typeInto(attribute, 'country')
    typeInto(rule.getByLabelText('Value'), 'TH')
    fireEvent.change(rule.getByLabelText('Serve variation'), {
      target: { value: 'on' },
    })

    await waitFor(() =>
      expect(previewJson().targeting).toEqual([
        {
          logic: 'and',
          conditions: [
            { attribute: 'country', operator: 'equals', value: 'TH' },
          ],
          variation: 'on',
        },
      ]),
    )

    fireEvent.click(screen.getByRole('button', { name: /add condition/i }))
    fireEvent.change(rule.getAllByLabelText('Operator')[1], {
      target: { value: 'in' },
    })
    typeInto(rule.getAllByLabelText('Attribute')[1], 'plan')
    typeInto(rule.getAllByLabelText('Value')[1], 'pro, team')

    await waitFor(() =>
      expect(previewJson().targeting[0].conditions[1]).toEqual({
        attribute: 'plan',
        operator: 'in',
        value: ['pro', 'team'],
      }),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove condition 2' }))
    await waitFor(() =>
      expect(previewJson().targeting[0].conditions).toHaveLength(1),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove rule 1' }))
    expect(previewJson().targeting).toEqual([])
  })

  it('drops the value for operators that do not need one', async () => {
    render(<FeatureFlagEditor />)

    fireEvent.click(screen.getByRole('button', { name: /add rule/i }))
    typeInto(screen.getByLabelText('Attribute'), 'role')
    fireEvent.change(screen.getByLabelText('Operator'), {
      target: { value: 'isTrue' },
    })

    await waitFor(() =>
      expect(previewJson().targeting[0].conditions[0]).toEqual({
        attribute: 'role',
        operator: 'isTrue',
      }),
    )
  })

  it('blocks an invalid submit and lists the issues', async () => {
    render(<FeatureFlagEditor />)

    typeInto(screen.getByLabelText('Flag key'), '')
    fireEvent.click(screen.getByRole('button', { name: /save flag/i }))

    expect(screen.getByText('Unique identifier used by the SDK.')).toBeTruthy()
    expect(await screen.findByText('Flag key is required')).toBeTruthy()

    const summary = await screen.findByRole('alert')
    expect(
      within(summary).getByText(/issue.*to fix\s+before saving/),
    ).toBeTruthy()
    expect(within(summary).getAllByText('Flag key').length).toBeGreaterThan(0)
    expect(within(summary).getByText(/Flag key is required/)).toBeTruthy()
    expect(screen.queryByText(/^Saved/)).toBeNull()
  })

  it('saves a valid flag and can reset back to the initial state', async () => {
    render(<FeatureFlagEditor />)

    typeInto(screen.getByLabelText('Flag key'), 'checkout-v2')
    fireEvent.click(screen.getByRole('button', { name: /save flag/i }))

    expect(await screen.findByText(/^Saved/)).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(valueOf('Flag key')).toBe('new-checkout')
    expect(previewJson().key).toBe('new-checkout')
    expect(screen.queryByText(/^Saved/)).toBeNull()
  })
})
