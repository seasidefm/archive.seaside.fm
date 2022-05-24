export const deleteFavorite = async (
    id: string,
    refetch: () => Promise<any>,
    isSuperfave = false
) => {
    await fetch(`/api/${isSuperfave ? "superfaves" : "faves"}/delete`, {
        method: "POST",
        body: JSON.stringify({
            fave_id: id,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    await refetch();
};
