import { joinContentStructure, metaEntity, addChildrenPermalink } from '../src/helpers'

describe('joinContentStructure', () => {
  const mockChild = {
    name: 'Some name',
  }
  const mockChildren = [mockChild]
  test('When have no any child', () => {
    expect(joinContentStructure({})).toEqual({ children: [] })
  })
  test('when have children', () => {
    expect(joinContentStructure({ children: mockChildren })).toEqual({ children: mockChildren })
  })
  test('when have nodeModules', () => {
    expect(joinContentStructure({ nodeModules: mockChildren })).toEqual({ children: mockChildren })
  })
  test('when have items', () => {
    expect(joinContentStructure({ items: mockChildren })).toEqual({ children: mockChildren })
  })
  test('when have media', () => {
    expect(joinContentStructure({ media: mockChildren })).toEqual({ children: mockChildren })
  })
  test('when have children and media', () => {
    expect(joinContentStructure({ children: mockChildren, media: mockChildren })).toEqual({
      children: [...mockChildren, ...mockChildren],
    })
  })
})
describe('metaEntity', () => {
  const mockEntity = (num = 1) => ({ name: `Some name ${num}` })
  test('When have no entities', () => {
    const mock = {
      meta: {
        entities: [],
      },
    }
    expect(metaEntity(mock)).toEqual(undefined)
  })
  test('When have only one entity', () => {
    const mock = {
      meta: {
        entities: [mockEntity()],
      },
    }
    expect(metaEntity(mock)).toEqual(mockEntity())
  })
  test('When have many entities', () => {
    const mock = {
      meta: {
        entities: [mockEntity(), mockEntity(2), mockEntity(3)],
      },
    }
    expect(metaEntity(mock)).toEqual(mockEntity(3))
  })
})
describe('addChildrenPermalink', () => {
  const testter = addChildrenPermalink('parent-permalink')
  test('When have no children', () => {
    expect(testter({})).toEqual({ children: [] })
  })
  test('When have one or more children with permalink', () => {
    const mockChild = { name: 'Some Child Name', permalink: 'some/child/permalink' }
    expect(testter({ children: [mockChild] })).toEqual({ children: [mockChild] })
    expect(testter({ children: [mockChild, mockChild] })).toEqual({ children: [mockChild, mockChild] })
  })
  test('When have one or more children without permalink but with slug', () => {
    const mockChild = { name: 'Some Child Name', slug: 'some-child-slug' }
    expect(testter({ children: [mockChild] })).toEqual({
      children: [{ name: 'Some Child Name', slug: 'some-child-slug', permalink: 'parent-permalink/some-child-slug' }],
    })

    expect(testter({ children: [mockChild, mockChild] })).toEqual({
      children: [
        { name: 'Some Child Name', slug: 'some-child-slug', permalink: 'parent-permalink/some-child-slug' },
        { name: 'Some Child Name', slug: 'some-child-slug', permalink: 'parent-permalink/some-child-slug' },
      ],
    })
  })
  test('When have children with and without permalink', () => {
    const mockChild1 = { name: 'Some Child Name', permalink: 'some/child/permalink' }
    const mockChild2 = { name: 'Some Child Name', slug: 'some-child-slug' }
    expect(testter({ children: [mockChild1, mockChild2] })).toEqual({
      children: [mockChild1, { ...mockChild2, permalink: `parent-permalink/${mockChild2.slug}` }],
    })
  })
})
