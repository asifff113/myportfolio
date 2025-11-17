import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if Firebase is configured
    if (!db) {
      console.warn("Firebase not configured, logging message to console:");
      console.log({
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
      });
      
      return NextResponse.json(
        {
          success: true,
          message: "Message received (Firebase not configured - check server logs)",
        },
        { status: 200 }
      );
    }

    // Save to Firestore
    const messagesRef = collection(db, "contactMessages");
    const docRef = await addDoc(messagesRef, {
      name,
      email,
      subject,
      message,
      status: "unread",
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
    });

    // TODO: Send email notification
    // You can integrate SendGrid, Resend, or any email service here
    // Example with SendGrid:
    // await sendEmailNotification({ name, email, subject, message });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
        id: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve messages (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // const session = await getServerSession();
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!db) {
      return NextResponse.json(
        { error: "Firebase not configured" },
        { status: 503 }
      );
    }

    const messagesRef = collection(db, "contactMessages");
    const { getDocs, query, orderBy: firestoreOrderBy } = await import("firebase/firestore");
    const q = query(messagesRef, firestoreOrderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    }));

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

