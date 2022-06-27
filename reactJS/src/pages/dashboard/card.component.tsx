import React, { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  Card,
  Image,
  Text,
  Group,
  RingProgress,
  useMantineTheme,
  Badge,
  ActionIcon,
  LoadingOverlay,
} from "@mantine/core";
import { Clock } from "tabler-icons-react";
import * as CurrencyFormat from "react-currency-format";
import { gql, GraphQLClient } from "graphql-request";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from "react-query";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

interface CardWithStatsProps {
  id: string;
  name_item: string;
  description: string;
  index: number;
  badgeColor: string;
  price: number;
  stock: number;
  deleteMode: string;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<any, unknown>>;
}

export function CardWithStats({
  deleteMode,
  id,
  name_item,
  description,
  price,
  stock,
  index,
  badgeColor,
  refetch,
}: CardWithStatsProps) {
  const { classes } = useStyles();
  const [imageFetched, setImageFetched] = useState(Date.now());
  const client = new GraphQLClient("/gql/query");
  const { mutate: deleteItemMutation, isLoading } = useMutation(
    async (id: string) => {
      const query = gql`mutation{
            deleteItem(id : "${id}")
          }`;
      return await client.request(query, {
        id,
      });
    },
    {
      onSuccess: () => {
        setImageFetched(Date.now());
        refetch();
      },
    }
  );

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Nama Item</th>
          <th>Stock</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      {/* <tbody>
        <tr>
          <td>{name_item}</td>
          <td>{stock}</td>
          <td>{description}</td>
          <td>{price}</td>
        </tr>
      </tbody> */}
    </Table>
  );
}
