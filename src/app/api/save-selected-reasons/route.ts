import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userID, reasons } = await request.json();

        const mostRecentActivity = await prisma.userActivity.findFirst({
            where: {
              userId: userID
            },
            orderBy: {
              Activityid: 'desc'
            }
        });

        const activityId = mostRecentActivity?.Activityid ?? "";

        await prisma.userActivity.update({
            where: { Activityid: activityId },
            data: { pdf_reasons: reasons }
        })

        return Response.json(
        { success: true, message: 'Reason updated successfully'},
        { status: 200 }
        );
    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json(
            { success: false, message: 'Error verifying user' },
            { status: 500 }
        );
    }
}