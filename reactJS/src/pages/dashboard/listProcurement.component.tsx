import {
  Center,
  Grid,
  LoadingOverlay,
  SimpleGrid,
  Text,
  useMantineTheme,
  Table,
} from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { gql, GraphQLClient } from "graphql-request";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { CardWithStats } from "./card.component";

interface item {
  id: string;
  name_item: string;
  stock: number;
  description: string;
  price: number;
  qty: number;
}

interface ListFurniture {
  deleteMode: string;
}
function ListFurniture({ deleteMode }: ListFurniture) {
  const [styles, setStyles] = useState([]);

  const COLOR_LIST = Object.keys(useMantineTheme().colors);
  const [badgeColors, setBadgeColors] = useSetState<any>({});

  const client = new GraphQLClient("/gql/query", {
    headers: {
      authorization: "Bearer " + localStorage.getItem("jwt"),
    },
  });

  const { isLoading, data, refetch } = useQuery(
    ["cardFurnitures", styles],
    async () => {
      const queryFilter = "";
      const query = gql`
        query items {
          items(input: {}) {
            id
            name_item
            stock
            description
            price
          }
        }
      `;
      return await client.request(query).then((data) => data.items);
    },
    {
      initialData: [],
    }
  );

  useEffect(() => {
    data.map((item: any) => {
      if (!Object.keys(badgeColors).includes(item.style)) {
        let colors = COLOR_LIST.sort(() => 0.5 - Math.random());
        colors.map((color: string) => {
          if (!Object.values(badgeColors).includes(color)) {
            setBadgeColors({ [item.style]: color });
          }
        });
      }
    });
  }, [data, badgeColors]);

  if (
    isLoading ||
    (data.length !== 0 && Object.keys(badgeColors).length === 0)
  ) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
      {data.length === 0 && <Center mb="sm"> No Data</Center>}

      <Table horizontalSpacing="xl" verticalSpacing="sm">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Item</th>
            <th>Stock</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i: item, index: number) => (
            <tr>
              <td>{index + 1}</td>
              <td>{i.name_item}</td>
              <td>{i.stock}</td>
              <td>{i.description}</td>
              <td>{i.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default ListFurniture;
