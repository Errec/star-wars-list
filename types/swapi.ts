export interface Person {
  id: number
  name: string
  height: string
  mass: string
  birthYear: string
  gender: string
  planetId: number | null
  planetName: string
}

export interface PlanetDetails {
  id: number
  name: string
  terrain: string
  population: string
  diameter: string
  residentsNames: string[]
}

export interface PeopleApiResponse {
  total: number
  nextPage: number | null
  previousPage: number | null
  results: Person[]
}
