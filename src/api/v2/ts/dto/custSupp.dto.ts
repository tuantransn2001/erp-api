import {
  CustSuppAttributes,
  UserAddressAttributes,
  UserAttributes,
} from "../interfaces/entities_interfaces";

export interface CreateCustSuppDTO
  extends Partial<UserAttributes>,
    Partial<CustSuppAttributes> {
  address_list: UserAddressAttributes[];
  tags: string[];
}

export interface UpdateCustSuppDTO extends Partial<CreateCustSuppDTO> {
  custSupp_id: string;
}
