import { collection, limit, orderBy, query } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Form from "./Form";
import Messages from "./Messages";
import { createStyles, Switch, Group, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';



const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    '& *': {
      cursor: 'pointer',
    },
  },

  icon: {
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
    top: 3,
  },

  iconLight: {
    left: 4,
    color: theme.white,
  },

  iconDark: {
    right: 4,
    color: theme.colors.gray[6],
  },
}));

export function SwitchToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes, cx } = useStyles();

  return (
    <Group position="center" my={30}>
      <div className={classes.root}>
        <IconSun className={cx(classes.icon, classes.iconLight)} size={18} stroke={1.5} />
        <IconMoonStars className={cx(classes.icon, classes.iconDark)} size={18} stroke={1.5} />
        <Switch checked={colorScheme === 'dark'} onChange={() => toggleColorScheme()} size="md" />
      </div>
    </Group>
  );
}



export default function Channel() {
  const firestore = useFirestore();
  const messagesCollection = collection(firestore, "messages");
  const messagesQuery = query(
    messagesCollection,
    orderBy("createdAt"),
    limit(100)
  );

  const { status, data: messages } = useFirestoreCollectionData(messagesQuery, {
    idField: "id", // this field will be added to the object created from each document
  });

  return (
    <div>
      {status === "loading" ? (
        <span>loading...</span>
      ) : (
        <Messages messages={messages} />
      )}
      <Form messagesCollection={messagesCollection} />
    </div>
  );
}
