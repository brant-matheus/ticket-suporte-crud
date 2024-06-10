import { ApiResponse } from '@japa/api-client'
import collect from 'collect.js'

interface JsonStructure {
  [key: string]: JsonStructure | string[] | any
}

declare module '@japa/api-client' {
  interface ApiResponse {
    /**
     * Assert response has validation errors on match keys.
     */
    assertInvalid(keys: string[]): void

    /**
     * Assert that the response has a given JSON structure.
     */
    assertJsonStructure(structure: string[] | JsonStructure, responseData?: any): void

    /**
     * Assert that the response has a given Paginated JSON structure.
     */
    assertPaginatedStructure(structure: string[] | JsonStructure, responseData?: any): void

    /**
     * Assert that the response has a given JSON structure.
     */
    assertBodyLength(length: number, key?: string): void
  }
}

ApiResponse.macro('assertInvalid', function (this: ApiResponse, keys: string[]) {
  this.ensureHasAssert()

  const { errors } = this.body()

  const errorFields = collect(errors).pluck('field').toArray()

  this.assert?.includeDeepMembers(errorFields, keys)

  return
})

ApiResponse.macro('assertBodyLength', function (this: ApiResponse, length: number, key?: string) {
  this.ensureHasAssert()

  const body = this.body()
  const value = key ? body[key] : body

  this.assert?.lengthOf(value, length)
})

ApiResponse.macro(
  'assertPaginatedStructure',
  function (this: ApiResponse, structure: JsonStructure | string[], responseData?: any) {
    const paginatedStructure = {
      meta: ['total', 'perPage', 'currentPage', 'lastPage'],
      data: structure,
    }

    this.assertJsonStructure(paginatedStructure, responseData)
  }
)

ApiResponse.macro(
  'assertJsonStructure',
  function (this: ApiResponse, structure: JsonStructure | string[], responseData?: any) {
    this.ensureHasAssert()

    responseData ??= this.body() as Record<string, any>

    if (Array.isArray(structure)) {
      this.assert?.properties(responseData, structure)

      return
    }

    if (typeof structure !== 'object') {
      this.assert?.equal(
        typeof responseData,
        typeof structure,
        `${responseData} should be of type ${typeof structure}`
      )

      return
    }

    Object.entries(structure).forEach(([key, value]) => {
      if (key === '*') {
        this.assert?.isArray(responseData)

        return responseData.forEach((item: any) => this.assertJsonStructure(value, item))
      }

      this.assert?.property(responseData, key)

      if (Array.isArray(value)) {
        return this.assertJsonStructure(value, responseData[key])
      }

      this.assertJsonStructure(value, responseData[key])
    })

    return
  }
)
