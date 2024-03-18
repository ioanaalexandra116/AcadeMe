import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
const CreateFlashcardSet = () => {
  return (
    <>
        <Card style={{ width: "300px", height: "175px" }}>
            <CardHeader>
            <CardTitle>Test</CardTitle>
            <CardDescription>Test</CardDescription>
            </CardHeader>
            <CardContent>
            <p>Test</p>
            </CardContent>
        </Card>
    </>
  );
};

export default CreateFlashcardSet;