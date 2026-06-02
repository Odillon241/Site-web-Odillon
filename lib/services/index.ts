export type { ServiceData } from "./types"

import { gouvernanceService } from "./gouvernance"
import { juridiqueService } from "./juridique"
import { ressourcesHumainesService } from "./ressources-humaines"
import { formationsService } from "./formations"

export const servicesData = [
  gouvernanceService,
  juridiqueService,
  ressourcesHumainesService,
  formationsService,
]
