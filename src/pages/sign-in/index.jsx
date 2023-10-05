import {
    Anchor,
    Button,
    Card,
    Center,
    createStyles,
    Flex,
    Group,
    LoadingOverlay,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt, IconCheck, IconFaceId, IconFaceIdError, IconPassword } from "@tabler/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import logo from "@/assets/mht.png";
import Link from "next/link";
import axiosAuth from "@/libs/auth/axios";
import { hasCookie, setCookie } from "cookies-next";
import { AxiosError } from "axios";
import { showNotification } from "@mantine/notifications";
const useStyles = createStyles((theme) => ({
    anchor: {
        fontWeight: 700,
    },
    label: {
        fontWeight: 600,
        fontSize: theme.fontSizes.sm,
    },
}));

const SignIn = () => {
    const router = useRouter();
    const form = useForm({
        initialValues: {
            username: "",
            password: "",
        },
    });
    const [visible, setVisible] = useState(false);
    const handleSubmit = useCallback(() => {
        const handleLogin = async () => {
            setVisible(true);
            try {
                const { data } = await axiosAuth.post("/auth/login", {
                    username: form.values.username,
                    password: form.values.password,
                });
                setCookie("auth", `Bearer ${data.data.token}`, {
                    maxAge: 60 * 6 * 24,
                });
                setCookie(
                    "user",
                    {
                        username: data.data.username,
                        name: data.data.name,
                        id: data.data.id,
                        image: data.data.image,
                    },
                    {
                        maxAge: 60 * 6 * 24,
                    }
                );
                showNotification({
                    title: "Successful Login",
                    message: "Login Success👏",
                    icon: <IconFaceId />,
                    color: "teal",
                });
                router.push("/home");
            } catch (error) {
                if (error instanceof AxiosError) {
                    showNotification({
                        title: "Error Attempting Authorization",
                        message: error?.response?.data?.message ?? "Connection Error",
                        icon: <IconFaceIdError />,
                        color: "red",
                    });

                }
            } finally {
                setVisible(false);
            }
        };
        handleLogin();
    }, [form]);
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const emailRef = useRef();
    const passwordRef = useRef();
    useEffect(() => {
        emailRef.current.focus();
    }, []);
    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card
                withBorder
                shadow={"xl"}
                p={"xl"}
                sx={(theme) => ({
                    maxWidth: 500,
                    width: "100%",
                    height: "auto",
                    position: "relative",
                })}
                style={{ margin: 'auto' }}
            >
                <LoadingOverlay visible={visible} overlayBlur={2} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack p={"xl"}>
                        <Center>
                            <Image src={logo} height={100} alt="logo" style={{ backgroundColor: null }} />
                        </Center>
                        <Flex align={"center"} justify={"center"} direction={"column"}>
                            <Title order={4} align={"center"}>
                                RPA
                            </Title>
                            <Text size={"sm"}>a development towards HJP Smart Factory</Text>
                        </Flex>
                        <Flex gap={"md"} direction={"column"}>
                            <TextInput
                                disabled={visible}
                                size="md"
                                icon={<IconAt size={18} />}
                                variant="filled"
                                ref={emailRef}
                                label={<span className={classes.label}>Email</span>}
                                placeholder="Joe@mail.com"
                                required
                                withAsterisk
                                {...form.getInputProps("username")}
                            />
                            <PasswordInput
                                disabled={visible}
                                size="md"
                                icon={<IconPassword size={18} />}
                                variant="filled"
                                ref={passwordRef}
                                label={<span className={classes.label}>Password</span>}
                                placeholder="******"
                                required
                                withAsterisk
                                {...form.getInputProps("password")}
                            />
                            <Group position="right">
                                <Anchor component={Link} href="/auth/forgot-password" className={classes.anchor}>
                                    Forgot Password?
                                </Anchor>
                            </Group>
                        </Flex>
                        <Button type="submit" size="lg">
                            Sign In
                        </Button>
                    </Stack>
                </form>
            </Card>
        </div>
    );
};
export default SignIn;


export function getServerSideProps({ req, res }) {
    if (hasCookie('auth', { req, res })) {
        return {
            redirect: {
                permanent: true,
                destination: '/home',
            },
        }
    } else {
        return {
            props: {}
        }
    }
}