export type { ServiceData } from "./types"

import { gouvernanceService } from "./gouvernance"
import { juridiqueService } from "./juridique"
import { financesService } from "./finances"
import { ressourcesHumainesService } from "./ressources-humaines"
import { formationsService } from "./formations"
import { communicationService } from "./communication"
import { entreprenariatService } from "./entreprenariat"
import { paieService } from "./paie"

export const servicesData = [
  gouvernanceService,
  juridiqueService,
  financesService,
  ressourcesHumainesService,
  formationsService,
  communicationService,
  entreprenariatService,
  paieService,
]
